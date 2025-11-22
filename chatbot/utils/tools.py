from langchain_core.tools import tool
from rag.rag_chain import get_rag_chain

_cached_rag_chain = None  

@tool
async def rag_tool(query: str):
    """
    Stream token-by-token output from the RAG chain.
    """
    global _cached_rag_chain
    if _cached_rag_chain is None:
        _cached_rag_chain = get_rag_chain()

    async for chunk in _cached_rag_chain.astream(query):    
        yield chunk