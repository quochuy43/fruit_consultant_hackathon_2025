from langchain_qdrant import QdrantVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from qdrant_client import QdrantClient

import os
from dotenv import load_dotenv
load_dotenv()

_embeddings = None
_client = None

def get_retriever(collection_name="durian_overview", k=4):
    global _embeddings, _client
    
    if _embeddings is None:
        _embeddings = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-001",
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )
    
    if _client is None:
        _client = QdrantClient(
            url=os.getenv("QDRANT_URL"),
            timeout=120,
            prefer_grpc=False
        )
    
    vectordb = QdrantVectorStore(
        client=_client,
        embedding=_embeddings,
        collection_name=collection_name,
    )
    
    retriever = vectordb.as_retriever(search_kwargs={"k": k})
    return retriever

# retriever = get_retriever()
# docs = retriever.invoke("ngừa bệnh thán thư trên cây sầu riêng")

# for d in docs:
#     print("-----")
#     print("Page content:", d.page_content)
#     print("Metadata:", d.metadata)

