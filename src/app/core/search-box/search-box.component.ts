import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CsvParserService } from './../../shared/services/csv-parser.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  companySearchControl = new FormControl();
  filteredOptions: Observable<any[]>;

  constructor(
    private csvService: CsvParserService,
    private router: Router) { }


  ngOnInit() {
    this.filterOptions();
  }

  navigateToUrl() {
    let companyName = this.companySearchControl.value.toLowerCase();
    let companyCode = companyName.slice(-4, -1);
    this.router.navigateByUrl('/share/' + companyCode);
  }

  filterOptions() {
    this.filteredOptions = this.companySearchControl.valueChanges
      .pipe(
        startWith(null),
        debounceTime(100),
        distinctUntilChanged(),
        switchMap(val => {
          return this.filter(val || '')
        })
      )
  }

  filter(value: string): Observable<any[]> {
    return this.csvService.getNamesWithCodes()
      .pipe(map(res => res.filter(option => {
        return option.toLowerCase().includes(value)
      }))
    )
  }

}
