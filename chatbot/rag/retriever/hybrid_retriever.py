from rag.retriever.basic_retriever import get_retriever  
from rag.retriever.keyword_retriever import get_keyword_retriever  
from langchain_classic.retrievers import EnsembleRetriever


def get_hybrid_retriever(alpha=0.5, keyword_k=3):
    """
    Create hybrid retriever: combine embedding (Qdrant) and keyword (TF-IDF).
    alpha: embedding retriever priority weight (0.0 - 1.0)
    """

    embedding_retriever = get_retriever()
    keyword_retriever = get_keyword_retriever(k=keyword_k)

    hybrid_retriever = EnsembleRetriever(
        retrievers=[embedding_retriever, keyword_retriever],
        weights=[alpha, 1 - alpha]
    )

    return hybrid_retriever
