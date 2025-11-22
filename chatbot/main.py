from fastapi import FastAPI, Form, HTTPException, UploadFile, File
from langchain_core.messages import HumanMessage, AIMessage
from dotenv import load_dotenv
from contextlib import asynccontextmanager
import os
from typing import Dict, List, Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from rag.rag_chain import get_rag_chain 
from tempfile import NamedTemporaryFile
import shutil

# Import hàm vision của bạn
from utils.computer_vision.cv_config import detect_disease_internal

load_dotenv()

_cached_rag_chain = None
user_states: Dict[str, List] = {} 

@asynccontextmanager
async def lifespan(app: FastAPI):
    global _cached_rag_chain
    _cached_rag_chain = get_rag_chain()
    print("🚀 RAG Chatbot server ready!")
    yield
    print("🛑 Closed RAG server")

app = FastAPI(title="RAG Chatbot API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat/stream")
async def chat_stream(
    user_id: str = Form(...),
    message: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    # 1. Validate cơ bản
    if not user_id or not message:
        raise HTTPException(status_code=400, detail="user_id và message là bắt buộc")

    if image and not image.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Chỉ chấp nhận file ảnh (image/*)")
    
    # 2. Chuẩn bị nội dung tin nhắn (Content preparation)
    final_content = message # Mặc định là tin nhắn gốc
    
    # Xử lý ảnh nếu có
    if image:
        temp_image_path = None
        try:
            # Tạo file tạm
            with NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
                shutil.copyfileobj(image.file, tmp)
                temp_image_path = tmp.name
            
            # Gọi model Vision
            vision_result = detect_disease_internal(temp_image_path)
            
            # Nối kết quả vision vào nội dung tin nhắn
            vision_info = f" {vision_result['label_vi']} trên cây sầu riêng"
            final_content = message + vision_info
            
        except Exception as e:
            print(f"❌ Vision Error: {e}")
            final_content = message + "\n(Hệ thống gặp lỗi khi phân tích ảnh đính kèm)"
            
        finally:
            # QUAN TRỌNG: Xóa file tạm sau khi xử lý xong để tránh đầy ổ cứng
            if temp_image_path and os.path.exists(temp_image_path):
                os.unlink(temp_image_path)

    # 3. Tạo message object (Chỉ tạo 1 lần ở đây)
    input_message = HumanMessage(content=final_content)
    
    # Lấy history cũ
    old_messages: List = user_states.get(user_id, [])

    async def stream_generator():
        try:
            # Cập nhật history tạm thời để chuẩn bị query
            new_messages = old_messages + [input_message]
            
            # QUAN TRỌNG: Query gửi cho RAG phải là nội dung đã gộp Vision
            query = final_content 
            
            # (Optional) Nếu muốn RAG nhận cả history thì xử lý query tại đây
            # query = "\n".join([m.content for m in new_messages[-3:]]) 

            full_text = ""
            async for chunk in _cached_rag_chain.astream(query):
                if chunk:
                    full_text += chunk
                    yield chunk
            
            # Lưu state sau khi stream xong
            full_response = AIMessage(content=full_text)
            updated_messages = new_messages + [full_response]
            user_states[user_id] = updated_messages
            
        except Exception as e:
            yield f"\n\n⚠️ Error: {str(e)}"
    
    return StreamingResponse(
        stream_generator(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Access-Control-Allow-Origin": "*",
        }
    )