from fastapi.testclient import TestClient
from app.main import app

def test_create_exercises():
    client = TestClient(app)
    request_data = {
        "text": "Hola mundo. Adiós mundo. ¿Cómo estás? Todo bien, gracias a Dios. Espero que estés teniendo un buen día.",
        "passage_size": 2
    }
    response = client.post("/create_exercises", json=request_data)
    assert response.status_code == 200
    data = response.json()
    assert len(data["exercises"]) > 0