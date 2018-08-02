import { Component, OnInit, ViewChild } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import {MatSidenav} from '@angular/material/sidenav';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;

  title = 'app';
  theme = 'scorpion-theme-light';

  constructor(
    private overlayContainer: OverlayContainer
  ) { }

  ngOnInit() {
    this.overlayContainer.getContainerElement().classList.add(this.theme);
  }

  onThemeChange(theme: string) {
    this.theme = theme;
    //console.log(theme);
    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
    const themeClassesToRemove = Array.from(overlayContainerClasses).filter((item: string) => item.includes('-theme'));
    if (themeClassesToRemove.length) {
       overlayContainerClasses.remove(...themeClassesToRemove);
    }
    overlayContainerClasses.add(theme);
  }

  close() {
    this.sidenav.close();
  }

}
