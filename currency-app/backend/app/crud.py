# backend/app/crud.py

import requests
from sqlalchemy.orm import Session
from datetime import datetime, date
from models import CurrencyRate

NBP_URL_TABLE = "https://api.nbp.pl/api/exchangerates/tables/A"

def fetch_and_store_currency_rates(db: Session, target_date: date):
    """
    Pobiera z NBP wszystkie kursy walut dla podanej daty `target_date`
    i zapisuje je w tabeli currency_rates.
    """
    url = f"{NBP_URL_TABLE}/{target_date}?format=json"
    response = requests.get(url)

    if response.status_code != 200:
        raise Exception("Błąd podczas pobierania danych z API NBP")

    data = response.json()
    if not data:
        # Jeśli zwrócono pustą listę, nie ma danych
        return

    table_entry = data[0]
    # Data jest w table_entry["effectiveDate"]
    date_str = table_entry.get("effectiveDate")
    date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()

    rates_list = table_entry.get("rates", [])

    for entry in rates_list:
        # entry ma klucze: "currency", "code", "mid"
        cr = CurrencyRate(
            currency=entry["currency"],
            code=entry["code"],
            rate=entry["mid"],
            date=date_obj
        )
        db.merge(cr)

    db.commit()
