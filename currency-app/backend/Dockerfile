FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
# Wydłużony timeout dla pip
RUN pip install --no-cache-dir --default-timeout=100 -r requirements.txt

COPY app/ .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]