import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const apiKey = 'WEXP46DZZBON9J5X';

const stockEnum = {
    '1. open': 'open',
    '2. high': 'high',
    '3. low': 'low',
    '4. close': 'close',
    '5. volume': 'volume'
};

@Injectable({
  providedIn: 'root'
})
export class SecurityDataService {

  constructor(private http: HttpClient) { }

  formUrl(code: string): string {
    let alphavantage = 'https://www.alphavantage.co/query?function=';
    let reportingPeriod = 'TIME_SERIES_DAILY';
    let outputSize = 'compact';
    let url = alphavantage +
              reportingPeriod + '&symbol=' +
              code + '.ax&interval=1min&apikey=' +
              apiKey;

    return url;
  }

  getSecurityData(code: string): Observable<{}> {
    let url = this.formUrl(code);
    let timeSeries = 'Time Series (Daily)';

    return this.http.get(url)
      .map(res => {
        let data = res;
        data = data[timeSeries][Object.keys(data[timeSeries])[0]];

        const newData = {};
        for (const key in data) {
            newData[stockEnum[key]] = parseFloat(data[key]).toFixed(2);
        }

        return newData;
      })
  }
}
