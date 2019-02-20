import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { PolymerModule } from '@codebakery/origami';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule, // Origami requires the Angular Forms module
    PolymerModule.forRoot(), // Do not call .forRoot() when importing in child modules
  ],
  declarations: [
    AppComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
