import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CurrencyService } from '../../services/currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrencyService],
    });

    service = TestBed.inject(CurrencyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // upewnia się, że nie zostały żadne otwarte zapytania
  });

  it('should fetch all currencies via GET', () => {
    const dummyData = [{ code: 'USD', rate: 4.1 }];

    service.getAllCurrencies().subscribe((data) => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne('http://localhost:8000/currencies');
    expect(req.request.method).toBe('GET');
    req.flush(dummyData); // symulacja odpowiedzi
  });

  it('should fetch currency for a given date via POST', () => {
    const testDate = '2024-01-01';

    service.fetchCurrency(testDate).subscribe();

    const req = httpMock.expectOne((r) =>
      r.url === 'http://localhost:8000/currencies/fetch' &&
      r.method === 'POST' &&
      r.params.get('target_date') === testDate
    );
    expect(req).toBeTruthy();
    req.flush({}); // symulacja pustej odpowiedzi
  });
});
