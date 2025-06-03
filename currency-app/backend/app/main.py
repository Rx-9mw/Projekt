# backend/app/main.py

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
import time
from sqlalchemy.exc import OperationalError
from fastapi.middleware.cors import CORSMiddleware

import schemas
import models
import crud
import database

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Dopuszczony frontend Angular
    allow_credentials=True,
    allow_methods=["*"],  # Możesz ograniczyć do ["GET", "POST"]
    allow_headers=["*"],
)

# Najpierw czekamy, aż baza danych będzie gotowa
max_tries = 10
delay_seconds = 2
for attempt in range(max_tries):
    try:
        models.Base.metadata.create_all(bind=database.engine)
        break
    except OperationalError:
        if attempt < max_tries - 1:
            time.sleep(delay_seconds)
        else:
            raise

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/currencies/fetch")
def fetch_data(target_date: str, db: Session = Depends(get_db)):
    # 1️⃣ Walidacja formatu daty
    try:
        date_obj = datetime.strptime(target_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    
    # 2️⃣ Wywołujemy zaktualizowaną funkcję, która pobiera wszystkie waluty
    crud.fetch_and_store_currency_rates(db, date_obj)
    return {"message": f"Dane z dnia {target_date} zostały zapisane."}

@app.get("/currencies", response_model=List[schemas.CurrencyRateOut])
def read_all_currencies(db: Session = Depends(get_db)):
    return db.query(models.CurrencyRate).all()

@app.get("/currencies/{date}", response_model=List[schemas.CurrencyRateOut])
def get_currency_rates_by_date(date: str, db: Session = Depends(get_db)):
    try:
        datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    
    rates = db.query(models.CurrencyRate).filter(models.CurrencyRate.date == date).all()
    if not rates:
        raise HTTPException(status_code=404, detail="No data found for the given date.")
    return rates
