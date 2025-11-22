import os
import pickle
from typing import Optional
from langchain_community.retrievers.tfidf import TFIDFRetriever
from rag.build_db.loader.document_loader import split_markdown_hierarchy

CACHE_DIR = os.path.join("rag", "cache")
CACHE_PATH = os.path.join(CACHE_DIR, "keyword_retriever.pkl")

def get_keyword_retriever(force_reload: bool = False, k: Optional[int] = None) -> TFIDFRetriever:
    """
    Returns keyword retriever from cache (if present), or creates new one if not cached or force_reload = True.
    
    Args:
        force_reload: Force reload từ documents
        k: Số chunks muốn lấy. Nếu None, dùng default của cache (4)
    """
    if not force_reload and os.path.exists(CACHE_PATH):
        with open(CACHE_PATH, "rb") as f:
            retriever = pickle.load(f)
            # Cập nhật k nếu được chỉ định
            if k is not None:
                retriever.k = k
            return retriever

    docs = split_markdown_hierarchy()
    
    # Tạo retriever với k nếu có, không thì default
    if k is not None:
        retriever = TFIDFRetriever.from_documents(docs, k=k)
    else:
        retriever = TFIDFRetriever.from_documents(docs)

    os.makedirs(CACHE_DIR, exist_ok=True)
    with open(CACHE_PATH, "wb") as f:
        pickle.dump(retriever, f)

    return retriever
