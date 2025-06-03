from sqlalchemy import Column, Integer, String, Float, Date
from database import Base

class CurrencyRate(Base):
    __tablename__ = "currency_rates"

    id = Column(Integer, primary_key=True, index=True)
    currency = Column(String, index=True)
    code = Column(String)
    rate = Column(Float)
    date = Column(Date, index=True)
