import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';

export interface CurrencyRate {
  code: number;
  currency: string;
  rate: number;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  rates = signal<CurrencyRate[]>([]);

  constructor(private http: HttpClient) {}

  // fetchRates() {
  //   this.http.get<CurrencyRate[]>('http://localhost:8000/currencies')
  //     .subscribe(data => this.rates.set(data));
  // }
  fetchRates() {
    const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

    this.http.post(`http://localhost:8000/currencies/fetch?target_date=${today}`, null).subscribe();

    this.http.get<CurrencyRate[]>(`http://localhost:8000/currencies`).subscribe(data => this.rates.set(data));
  }
}
