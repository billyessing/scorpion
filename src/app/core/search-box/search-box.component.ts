import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CsvParserService } from './../../shared/services/csv-parser.service';
import { FirestoreService } from './../../shared/services/firestore.service';
import { User } from './../../shared/models/user.model';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  @Input() searchParameter: string;

  placeholder: string;
  formSearchControl = new FormControl();

  filteredOptions: Observable<any[]>;

  constructor(
    private csvService: CsvParserService,
    private router: Router,
    private db: FirestoreService
  ) { }


  ngOnInit() {
    this.setPlaceholder();
    this.filterOptions(this.searchParameter);
  }

  setPlaceholder() {
    this.searchParameter == 'filterFriends' ? this.placeholder = 'Search users...' : this.placeholder = 'Search for company...'
  }

  navigateToUrl() {
    // search securities
    if (this.searchParameter == 'filterSecurities') {
      let companyName = this.formSearchControl.value.toLowerCase();
      let companyCode = companyName.slice(-4, -1);
      this.router.navigateByUrl('/share/' + companyCode);
    }

    // search friends
    else if (this.searchParameter == 'filterFriends') {
      let username = this.formSearchControl.value;
      this.router.navigateByUrl('/view-profile/' + username);
    }
  }

  filterOptions(searchParameter: string) {
    this.filteredOptions = this.formSearchControl.valueChanges.pipe(
      startWith(null),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(val => {
        if (searchParameter == 'filterFriends') {
          return this.filterFriends(val || '');
        } else if (searchParameter == 'filterSecurities') {
          return this.filterSecurities(val || '');
        }
      })
    )
  }

  filterSecurities(value: string): Observable<any[]> {
    return this.csvService.getNamesWithCodes().pipe(
      map(res => res.filter(option => {
        return option.toLowerCase().includes(value)
      }))
    )
  }

  // TODO: ignore self within search
  filterFriends(value: string): Observable<any[]> {
    return this.db.col$(`user_details`).pipe(
      map(userDetails => {
        let users = JSON.parse(JSON.stringify(userDetails));
        let usernames = []

        users.forEach(user => {
          usernames.push(user.username);
        })

        return usernames.filter(option => {
          if (option) {
            return option.toLowerCase().includes(value);
          }
        });
      }))
  }

}
