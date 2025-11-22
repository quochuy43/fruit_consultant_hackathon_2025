import os
from ultralytics import YOLO

# Ánh xạ bệnh
disease_mapping = {
    "Leaf_Algal": "bệnh đốm rong (Cephaleuros Virescens)",
    "Leaf_Blight": "bệnh cháy lá (Rhizoctonia Solani)",
    "Leaf_Colletotrichum": "bệnh thán thư (Anthracnose)",
    "Leaf_Phomopsis": "bệnh đốm lá do nấm Phomopsis (Durian Phomopsis Leaf Spot)",
    "Leaf_Rhizoctonia": "bệnh lá do nấm Rhizoctonia (Rhizoctonia Leaf Disease)",
    "Fruit_Rot": "bệnh thối trái (Durian Fruit Rot)",
    "Fruit_Mealybug": "bệnh rệp sáp (Mealybug)",
    "Leaf_Healthy": "Lá khỏe mạnh"
}

_model = None
def get_model():
    global _model
    if _model is None:
        _model = YOLO("utils/computer_vision/best.pt")
    return _model

def detect_disease_internal(image_path: str):
    """Internal detect để reuse trong chat."""
    model = get_model()
    results = model(image_path, verbose=False)
    name_dict = results[0].names
    pred_index = results[0].probs.top1
    pred_conf = float(results[0].probs.top1conf)
    pred_name = name_dict[pred_index]
    pred_name_vi = disease_mapping.get(pred_name, pred_name)
    os.unlink(image_path)  # Tức là khi yolo xử lí xong thì xóa file tạm đi
    return {
        "label": pred_name,
        "label_vi": pred_name_vi,
        "confidence": round(pred_conf * 100, 2)
    }