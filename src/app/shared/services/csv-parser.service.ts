import { Injectable } from '@angular/core';
import { Observable, Observer, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import { catchError, map, tap,startWith, switchMap, debounceTime, distinctUntilChanged, takeWhile, first } from 'rxjs/operators';

const filePath = './../assets/company-codes/company-codes.csv';

@Injectable({
  providedIn: 'root'
})
export class CsvParserService {

  constructor() { }

  parseCsv() {
    // use from to convert promise into observable
    return from(fetch(filePath)
      .then(response => response.text())
      .then(text => {
        let stripped = text.replace(/"/g,"");
        let companyList = stripped.split("\n");

        // remove title and headers
        return companyList.splice(2, companyList.length);
      }))
  }

  getSecurityDescriptive(code) {
    return this.parseCsv()
      .pipe(map(companies => {
        // console.log(companyList)
        let companyDetails = this.getSecurityDescriptiveWorker(companies, code);
        return companyDetails;
      }))
  }

  getSecurityDescriptiveWorker(companies, code): string[] {
    // used 'for let' for use of break
    let index = 0;
    for (let coy of companies) {
      let coyCode = coy.slice(0,3).toLowerCase();
      if (coyCode === code) { break }
      index++;
    }

    // TODO: change this to a redirect or something
    if (index === companies.length) {
      console.log("could not find match...")
    }

    // match found return company details
    else {
      let tokens = (companies[index].split(","));
      let companyDetails = [];

      companyDetails['code'] = tokens[0]
      companyDetails['name'] = tokens[1]
      companyDetails['industry'] = tokens[2]

      return companyDetails;
    }
  }

  getNamesWithCodes() {
    return this.parseCsv()
      .pipe(map(companies => {
        // console.log(companyList)
        let companyList = this.getNamesWithCodesWorker(companies);
        return companyList;
      }))
  }

  getNamesWithCodesWorker(companies): string[] {
    let companyList = []
    companies.forEach(coy => {
      let tokens = coy.split(",")

      // example format
      // Telstra Corporation Limited (TLS)
      let nameWithCode = tokens[1] + " (" + tokens[0] + ")"
      companyList.push(nameWithCode)
    });

    return companyList;
  }
}
