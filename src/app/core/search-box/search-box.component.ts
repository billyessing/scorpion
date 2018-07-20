import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, from } from 'rxjs';
import { catchError, map, tap,startWith, switchMap, debounceTime, distinctUntilChanged, takeWhile, first } from 'rxjs/operators';
import { FormGroup, FormGroupDirective, FormControl, FormBuilder, Validators } from '@angular/forms';

const filePath = './../assets/company-codes/company-codes.csv';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  searchForm: FormGroup;
  searchControl = new FormControl();

  companyList: string[] = [];

  // options: string[] = ['One', 'Two', 'Three'];
  // filteredOptions: Observable<string[]>;


  // testing
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;

  constructor(private router: Router) {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(null),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(val => {
          return this.filter(val || '')
        })
      )
  }

  filter(val: string): Observable<any[]> {
    return this.parseCsv()
      .pipe(
        map(res => res.filter(option => {
          return option.toLowerCase().indexOf(val.toLowerCase()) === 0
        }))
      )
  }

  ngOnInit() {
    this.searchForm = new FormGroup({
      companyName: new FormControl()
    })
    console.log(this.parseCsv())
    // this.filterOptions();
  }

  navigateToUrl() {
    let search = this.searchForm.get('companyName').value.toLowerCase()
    this.router.navigateByUrl('/share/' + search);
  }

  parseCsv() {
    return from(fetch(filePath)
      .then(response => response.text())
      .then(text => {
        let stripped = text.replace(/"/g,"");
        let companies = stripped.split("\n")

        companies.forEach(coy => {
          let tokens = coy.split(",")
          this.companyList = this.companyList.concat(tokens)
        });

        return this.companyList
      }))
  }



  // filterOptions() {
  //   this.filteredOptions = this.searchControl.valueChanges.pipe(
  //     startWith(''),
  //     map(value => this.filter(value))
  //   );
  // }
  //
  // filter(value: string): Observable<any[]> {
  //   const filterValue = value.toLowerCase();
  //   return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }
}
