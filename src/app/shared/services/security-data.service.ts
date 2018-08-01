import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, debounceTime, delay, throttleTime } from 'rxjs/operators';
import { Security } from './../models/security.model';

const apiKey = 'WEXP46DZZBON9J5X';

const securityEnum = {
  open: '1. open',
  high: '2. high',
  low: '3. low',
  close: '4. close',
  volume: '5. volume'
}

const timeSeries = {
  intraday: 'TIME_SERIES_INTRADAY',
  intradayFifteen: 'TIME_SERIES_INTRADAY',
  daily: 'TIME_SERIES_DAILY',
  dailyAdjusted: 'TIME_SERIES_DAILY_ADJUSTED',
  weekly: 'TIME_SERIES_WEEKLY',
  weeklyAdjusted: 'TIME_SERIES_WEEKLY_ADJUSTED',
  monthly:'TIME_SERIES_MONTHLY',
  monthlyAdjusted: 'TIME_SERIES_MONTHLY_ADJUSTED'
}

const timeSeriesHeader = {
  intraday: 'Time Series (1min)',
  intradayFifteen: 'Time Series (15min)',
  daily: 'Time Series (Daily)',
  dailyAdjusted: 'Time Series (Daily)',
  weekly: 'Weekly Time Series',
  weeklyAdjusted: 'Weekly Adjusted Time Series',
  monthly: 'Monthly Time Series',
  monthlyAdjusted: 'Monthly Adjusted Time Series'
}

@Injectable({
  providedIn: 'root'
})
export class SecurityDataService {

  securityData = {
    open: null,
    high: null,
    low: null,
    close: null,
    volume: null
  }

  securityPriceHistory = {
    prices: null,
    volumes: null,
    dates: null
  }

  constructor(private http: HttpClient) { }

  getSecurityData(code: string): Observable<{}> {
    const timePeriod = 'daily'
    const outputSize = 'compact'

    let url = this.getUrl(code, timePeriod, outputSize);
    let timeSeries = timeSeriesHeader[timePeriod];

    return this.http.get(url)
      .pipe(
        throttleTime(2000),
        map(data => {
          let keys = data[timeSeries][Object.keys(data[timeSeries])[0]];

          this.securityData.open = keys[securityEnum.open];
          this.securityData.high = keys[securityEnum.high];
          this.securityData.low = keys[securityEnum.low];
          this.securityData.close = keys[securityEnum.close];
          this.securityData.volume = keys[securityEnum.volume];

          return this.securityData;
      },
      err => console.log("sds.getSecurityData() could not fetch data...")
    ))
  }

  getHistoricalSecurityData(code: string, timePeriod: string): Observable<{}> {
    let timeSeries = this.getTimeSeries(timePeriod)
    let outputSize = this.getOutputSize(timePeriod)

    let url = this.getUrl(code, timeSeries, outputSize);
    let timeFreq = timeSeriesHeader[timeSeries];

    return this.http.get(url)
      .map(data => {
        let keys = Object.keys(data[timeFreq]);
        let keysReq = this.getTimePeriod(keys, timePeriod);
        let prices = [];
        let dates = [];
        let volumes = [];

        if (timePeriod === '1day') {
          keysReq.forEach(key => {
            let price = data[timeFreq][key][securityEnum.close];
            let volume = data[timeFreq][key][securityEnum.volume];
            let date = this.convertTime(key);

            prices.push(price);
            volumes.push(volume);
            dates.push(date);
          })
        }

        else {
          keysReq.forEach(key => {
            let price = data[timeFreq][key][securityEnum.close];
            let volume = data[timeFreq][key][securityEnum.volume];

            prices.push(price);
            volumes.push(volume);
            dates.push(key);
          })
        }

        this.securityPriceHistory.prices = prices;
        this.securityPriceHistory.volumes = volumes;
        this.securityPriceHistory.dates = dates;

        return this.securityPriceHistory;
      },
      err => console.log("sds.getHistoricalSecurityData() could not fetch data...")
    )
  }

  getTimePeriod(keys: string[], timePeriod: string): string[] {
    if (timePeriod === '1day') {
      let index = this.getStartTimeIntraday(keys);
      return keys.slice(0, index).reverse();
    }

    if (timePeriod === '5days') { return keys.slice(1, 6).reverse(); }
    if (timePeriod === '1month') { return keys.slice(1, 24).reverse(); }
    if (timePeriod === '3months') { return keys.slice(1, (22 * 3)).reverse(); }
    if (timePeriod === '6months') { return keys.slice(1, (22 * 6)).reverse(); }
    if (timePeriod === '1year') { return keys.slice(1, (22 * 12)).reverse(); }
    if (timePeriod === '5years') { return keys.slice(1, (5 * 12)).reverse(); }
  }

  getTimeSeries(timePeriod): string {
    if (timePeriod === '1day') {
      return 'intradayFifteen';
    }

    if (timePeriod === '5days' ||
        timePeriod === '1month' ||
        timePeriod === '3months' ||
        timePeriod === '6months' ||
        timePeriod === '1year') {
      return 'daily';
    }

    if (timePeriod === '5years') {
      return 'monthly';
    }
  }

  getOutputSize(timePeriod): string {
    if (timePeriod === '1day' ||
        timePeriod === '5days' ||
        timePeriod === '1month' ||
        timePeriod === '3months') {
      return 'compact'
    } else {
      return 'full'
    }
  }

  // convert US/Eastern time to user timezone
  convertTime(date: string): string {
    date.replace("/", "-");
    date.replace(" ", "T")
    date = new Date(Date.parse(date)).toUTCString()

    let tokens = date.split(' ');
    let trunc = tokens[4].substring(0,5)

    return trunc;
  }

  // utility function to find the index of the time
  // when the trading day started
  getStartTimeIntraday(dates): number {
    let index = 0;
    for (let date of dates) {
      let time = date.substring(11, date.length)
      if (time === "20:00:00" || time == "20:15:00") {
        index++;
        break;
      }
      index++;
    }

    // just in case no time match was found
    if (index > 24) { index = 24 }

    return index;
  }

  getUrl(code: string, timePeriod: string, outputSize: string): string {
    const alphavantage = 'http://www.alphavantage.co/query?function=';
    const interval = '15min';
    const url = alphavantage + timeSeries[timePeriod] + '&symbol=' + code + '.ax&interval=' +
              interval + '&outputsize=' + outputSize + '&apikey=' + apiKey;

    return url;
  }
}
