import { Component } from '@angular/core';

import '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects';
import '@polymer/app-layout/app-toolbar/app-toolbar';

import '@polymer/iron-icons/iron-icons';

import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-checkbox/paper-checkbox';
import '@polymer/paper-input/paper-input';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Polyng';
  value: string;
  checked: boolean;
}
