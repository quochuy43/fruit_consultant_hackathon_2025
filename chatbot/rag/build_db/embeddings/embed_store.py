from langchain_qdrant import QdrantVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings 
from rag.build_db.loader.document_loader import split_markdown_hierarchy

import os
from dotenv import load_dotenv
load_dotenv()

def get_embeddings():
    return GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001", 
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )

def create_vector_store(docs, collection_name="durian_overview"):
    embeddings = get_embeddings()
    # Tạo/upsert documents vào store
    vectordb = QdrantVectorStore.from_documents(
        documents=docs,
        embedding=embeddings,
        url=os.getenv("QDRANT_URL"),
        collection_name=collection_name,
    )
    return vectordb

def load_vector_store(collection_name="durian_overview"):
    embeddings = get_embeddings()
    vectordb = QdrantVectorStore(
        embedding=embeddings,
        url=os.getenv("QDRANT_URL"),
        collection_name=collection_name,
    )
    return vectordb

if __name__ == "__main__":
    # Create DB
    docs = split_markdown_hierarchy()
    vectorstore = create_vector_store(docs, collection_name="durian_overview")
    print("Đã tạo vector store thành công với Google Embeddings!")