import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from '../../services/currency.service';


@Component({
  selector: 'app-currency',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './currentcy-rates.html'
})
export class CurrentcyRates {
  targetDate = '';
  currencies: any[] = [];
  message = '';
  error = '';

  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {
    this.currencyService.getAllCurrencies().subscribe({
      next: (data : any) => this.currencies = data,
      error: () => this.error = 'Błąd pobierania danych.'
    });
  }

  fetch() {
    this.error = '';
    this.message = '';
    if (!this.targetDate) {
      this.error = 'Wprowadź datę.';
      return;
    }
    this.currencyService.fetchCurrency(this.targetDate).subscribe({
      next: (res : any) => {
        this.message = res.message;
        this.currencyService.getAllCurrencies().subscribe(data => this.currencies = data);
      },
      error: (err : any) => this.error = err.error?.detail || 'Błąd pobierania danych.'
    });
  }
}
