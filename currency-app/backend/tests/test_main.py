# backend/tests/test_main.py

from fastapi.testclient import TestClient
import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
app_dir = os.path.abspath(os.path.join(current_dir, os.pardir, "app"))
sys.path.insert(0, app_dir)

from main import app
from datetime import date

client = TestClient(app)

def test_fetch_currencies_from_nbp():
    test_date = "2024-04-25"
    response = client.post(f"/currencies/fetch?target_date={test_date}")
    assert response.status_code == 200
    assert "zostały zapisane" in response.json()["message"]

    # Teraz baza powinna mieć przynajmniej kilka różnych walut
    response2 = client.get("/currencies")
    assert response2.status_code == 200
    all_rates = response2.json()
    # Załóżmy, że NBP podało co najmniej 5 walut tego dnia
    assert len(all_rates) >= 5

def test_get_currencies_by_date():
    test_date = "2024-04-25"
    response = client.get(f"/currencies/{test_date}")
    assert response.status_code == 200
    data = response.json()
    # Sprawdzamy, że każdy element z listy ma klucze: currency, code, rate, date
    assert isinstance(data, list)
    assert all("currency" in elem and "code" in elem and "rate" in elem and "date" in elem for elem in data)
