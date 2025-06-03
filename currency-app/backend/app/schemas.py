from pydantic import BaseModel
from datetime import date

class CurrencyRateBase(BaseModel):
    currency: str
    code: str
    rate: float
    date: date

class CurrencyRateCreate(CurrencyRateBase):
    pass

class CurrencyRateInDB(CurrencyRateBase):
    id: int

    class Config:
        orm_mode = True

class CurrencyRateOut(BaseModel):
    currency: str
    code: str
    rate: float
    date: date

    class Config:
        from_attributes = True
