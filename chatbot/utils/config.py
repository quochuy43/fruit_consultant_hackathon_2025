import os
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
load_dotenv()

os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

model_google = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
    streaming=True
)