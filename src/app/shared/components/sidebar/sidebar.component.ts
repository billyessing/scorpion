import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { SettingsService } from './../../services/settings.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  toggleOpen: boolean = true;

  constructor(
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.settingsService.toggleStatus.subscribe(toggle => this.toggleOpen = toggle);
  }

  test() {
    console.log('test');
  }

}
