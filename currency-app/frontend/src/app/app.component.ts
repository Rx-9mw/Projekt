import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';

declare const sorttable: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div>
    <h1>Kursy walut</h1>
  </div>
  <div>
    <button (click)="load()">Załaduj</button>

    <table class="sortable" id="ratesTable">
      <thead>
        <tr>
          <th>Currency</th>
          <th>Rate</th>
          <th>code</th>
          <th>date</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let rate of api.rates()">
          <td>{{ rate.currency.toLowerCase() }}</td>
          <td>{{ rate.rate }}</td>
          <td>{{ rate.code }}</td>
          <td>{{ rate.date }}</td>
        </tr>
      </tbody>
    </table>
</div>
  `
})
export class AppComponent {
  api = inject(ApiService);

  load() {
    this.api.fetchRates();
    // Delay to let Angular render the table before sorttable is called
    setTimeout(() => {
      const table = document.getElementById('ratesTable');
      if (table && !table.classList.contains('sortable-initialized')) {
        sorttable.makeSortable(table);
        table.classList.add('sortable-initialized');
      }
    }, 0);
  }
}

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <h1>Kursy walut</h1>
//     <button (click)="load()">Załaduj</button>

//     <table class="sortable" id="ratesTable">
//       <thead>
//         <tr>
//           <th>Currency</th>
//           <th>Rate</th>
//         </tr>
//       </thead>
//       <tr *ngFor="let rate of api.rates()">
//         <td> {{ rate.currency }} </td>
//         <td> {{ rate.rate }} </td>
//       </tr>
//     </table>
//   `,
// })
// export class AppComponent {
//   api = inject(ApiService);

//   load() {
//     this.api.fetchRates();
//   }
// }
