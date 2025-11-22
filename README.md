# Fruit Consultant Chatbot

## Giới thiệu

Fruit Consultant là một ứng dụng chatbot chuyên tư vấn về cây trồng sầu riêng (durian). Ứng dụng kết hợp công nghệ AI để hỗ trợ người dùng qua giao diện di động, cho phép tương tác qua văn bản, giọng nói và hình ảnh. 

- **Back-end**: Xây dựng bằng FastAPI, tích hợp RAG (Retrieval-Augmented Generation) với Qdrant vector database và Google Embeddings.
- **Front-end**: Phát triển bằng React Native, hỗ trợ iOS và Android.

Ứng dụng giúp nông dân và người dùng dễ dàng nhận tư vấn về bệnh hại, chăm sóc và kiến thức liên quan đến sầu riêng.

## Tính năng chính

- **Chatbot tư vấn**: Hỏi đáp tự nhiên về thông tin sầu riêng (bệnh hại, kỹ thuật trồng trọt, v.v.).
- **Speech-to-Text**: Sử dụng micro để chuyển giọng nói thành văn bản, thay thế nhập tay.
- **Phân loại hình ảnh**: Chụp hoặc chọn ảnh bệnh sầu riêng từ thư viện để bot phân tích và tư vấn.

## Yêu cầu hệ thống (Prerequisites)

- **Hệ điều hành**: Windows, macOS hoặc Linux.
- **Docker**: Để chạy Qdrant vector database (phiên bản mới nhất).
- **Python 3.10+**: Với công cụ quản lý môi trường `uv` (cài đặt qua `pip install uv` nếu chưa có).
- **Node.js 18+ và npm**: Cho front-end React Native.
- **Ngrok**: Để expose back-end ra internet (tải tại [ngrok.com](https://ngrok.com)).
- **Google API Key**: Lấy từ [Google Cloud Console](https://console.cloud.google.com) cho Embeddings và Whisper model.
- **React Native CLI**: Cài đặt qua `npm install -g react-native-cli` (nếu cần).
- **Thiết bị di động**: Để test app qua QR code (iOS/Android).

## Cài đặt

### 1. Chạy Qdrant Vector Database
Qdrant là cơ sở dữ liệu vector cho RAG. Chạy container Docker:

```bash
docker run -d --name qdrant-local -p 6333:6333 qdrant/qdrant:latest
```

- Kiểm tra: Truy cập [http://localhost:6333/dashboard](http://localhost:6333/dashboard) để xem dashboard.

### 2. Cấu hình môi trường
Tạo file `.env` ở thư mục gốc của back-end (`chatbot/`):

```
GOOGLE_API_KEY=your_google_api_key_here
QDRANT_URL=http://localhost:6333/
```

- Thay `your_google_api_key_here` bằng API key thực tế.

### 3. Tải và cài đặt Model Whisper
Model Whisper dùng cho Speech-to-Text:

- Tải từ [Google Drive](https://drive.google.com/file/d/1eALZ2n3nweiWKQ1tiYEkfO3G5ZXZABek/view?usp=drive_link).
- Giải nén file và copy toàn bộ nội dung vào thư mục `chatbot/utils/speech_to_text/`.

### 4. Thiết lập môi trường ảo cho Back-end
Di chuyển vào thư mục back-end:

```bash
cd chatbot
uv venv
.venv\Scripts\activate  # Trên Windows; dùng 'source .venv/bin/activate' trên macOS/Linux
```

### 5. Xây dựng Vector Store
Nạp dữ liệu kiến thức về sầu riêng vào Qdrant:

```bash
uv run -m rag.build_db.embeddings.embed_store
```

- Thành công khi thấy thông báo: "Đã tạo vector store thành công với Google Embeddings!".
- Kiểm tra collection trên [http://localhost:6333/dashboard](http://localhost:6333/dashboard).

### 6. Chạy Back-end
Khởi động server FastAPI:

```bash
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

- Server chạy tại [http://localhost:8000](http://localhost:8000). Kiểm tra docs tại [http://localhost:8000/docs](http://localhost:8000/docs).

### 7. Expose Back-end qua Ngrok
Mở terminal mới và chạy:

```bash
ngrok http 8000
```

- Copy URL public (ví dụ: `https://abc123.ngrok.io`) để sử dụng ở front-end.

### 8. Cài đặt Front-end
Di chuyển vào thư mục front-end:

```bash
cd FruitConsultant
npm install
```

### 9. Cấu hình API URL
Mở file `services/chatService.tsx` và cập nhật:

```tsx
const API_URL = 'https://your-ngrok-url.ngrok.io';  // Thay bằng URL từ ngrok
```

### 10. Chạy Front-end
Khởi động app React Native:

```bash
npm start
```

- Quét QR code bằng app Expo Go (iOS/Android) để trải nghiệm.

## Sử dụng

1. Mở app trên thiết bị di động qua QR code.
2. **Chat văn bản**: Nhập câu hỏi về sầu riêng (ví dụ: "Bệnh thối rễ ở sầu riêng chữa thế nào?").
3. **Giọng nói**: Nhấn micro để ghi âm, bot sẽ chuyển thành text và trả lời.
4. **Hình ảnh**: Chụp/chọn ảnh lá/quả bị bệnh, bot phân loại và tư vấn.
5. Kết thúc phiên: Đóng app hoặc bắt đầu chat mới.

Lưu ý: App yêu cầu kết nối internet ổn định cho API và model AI.

## Khắc phục sự cố (Troubleshooting)

- **Qdrant không chạy**: Kiểm tra Docker (`docker ps`) và port 6333 không bị chiếm.
- **Lỗi Embeddings**: Xác nhận GOOGLE_API_KEY hợp lệ và quota chưa hết.
- **Ngrok timeout**: Tạo tunnel mới nếu URL hết hạn.
- **Front-end không kết nối**: Kiểm tra API_URL và firewall.
- **Model Whisper lỗi**: Đảm bảo file giải nén đúng thư mục và quyền đọc file.

Cảm ơn bạn đã sử dụng Fruit Consultant! Nếu cần hỗ trợ, liên hệ qua gmail kuhuylevan@gmail.com
