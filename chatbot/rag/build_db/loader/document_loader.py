from langchain_core.documents import Document

def split_markdown_hierarchy(file_path="rag/knowledge_base/durian_overview.md"):
    with open(file_path, "r", encoding="utf-8") as f:
        md_text = f.read()

    docs = []
    current_topic = None   # # heading
    current_section = None # ## topic

    for line in md_text.splitlines():
        if line.startswith("# "):  # cấp 1
            # flush section trước đó
            if current_section:
                docs.append(current_section)
                current_section = None

            current_topic = line[2:].strip()

            # Tạo section mặc định cho topic (phòng trường hợp không có ##)
            current_section = {
                "topic": current_topic,
                "title": current_topic,  # mặc định dùng topic làm title
                "content": [],
            }

        elif line.startswith("## "):  # cấp 2
            # flush section trước đó
            if current_section:
                docs.append(current_section)

            current_section = {
                "topic": current_topic,
                "title": line[3:].strip(),
                "content": [],
            }
        else:
            if current_section:
                if line.strip():  # bỏ dòng trống
                    current_section["content"].append(line.strip())

    # flush cái cuối cùng
    if current_section:
        docs.append(current_section)

    # Chuyển thành Document
    documents = []
    for sec in docs:
        content = "\n".join(sec["content"]).strip()
        if not content:
            continue
        documents.append(Document(
            page_content=content,
            metadata={
                "topic": sec["topic"],
                "title": sec["title"]
            }
        ))

    return documents


# Test
# chunks = split_markdown_hierarchy()
# for i, doc in enumerate(chunks, 1):
#     print(f"--- Chunk {i} ---")
#     print("Topic:", doc.metadata["topic"])
#     print("Title:", doc.metadata["title"])
#     print("Content:", doc.page_content)
#     print()
