// src/app/services/currency.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })  // This makes the service globally available
export class CurrencyService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  fetchCurrency(date: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/currencies/fetch`, null, {
      params: { target_date: date }
    });
  }

  getAllCurrencies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/currencies`);
  }
}
