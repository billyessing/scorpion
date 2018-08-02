import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { SidebarService } from './sidebar.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  // @Input() toggle: boolean = false;
  //
  //
  // events: string[] = [];
  // opened: boolean;
  //
  // getToggle() {
  //   console.log(this.toggle);
  //   this
  // }

  toggleOpen: boolean = true;

  constructor(private sb: SidebarService) { }

  ngOnInit() {
    this.sb.toggleStatus.subscribe(toggle => this.toggleOpen = toggle);
  }

}
