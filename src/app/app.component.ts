import { Component, OnInit, ViewChild } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatSidenav } from '@angular/material/sidenav';
import { SettingsService } from './shared/services/settings.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'app';

  theme: string;

  constructor(
    private overlayContainer: OverlayContainer,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.onThemeChange();
  }

  onThemeChange() {
    this.settingsService.themeSetting.subscribe(theme => {
      let overlayContainer = this.overlayContainer.getContainerElement().classList;
      // need to keep the first DOM token (cdk-overlay-container)
      // because it is required for overlay containers to be usable
      // (doesn't have any effect on style)
      this.overlayContainer.getContainerElement().classList.remove(overlayContainer[1]);
      this.overlayContainer.getContainerElement().classList.add(theme);
      this.theme = theme
    });
  }

  closeSidebar() {
    this.settingsService.toggle(false);
  }

}
