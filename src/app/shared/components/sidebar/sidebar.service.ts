import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SidebarService {

  private toggleOpen = new BehaviorSubject(false);
  toggleStatus = this.toggleOpen.asObservable();

  // private messageSource = new BehaviorSubject('default message');
  // currentMessage = this.messageSource.asObservable();

  constructor() { }

  toggle(toggleChange: boolean) {
    this.toggleOpen.next(toggleChange)
  }

}
