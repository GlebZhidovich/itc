import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UIRouterModule } from '@uirouter/angular';

import { AppComponent } from './app/app.component';
import { HelloPageComponent } from './pages/hello-page/hello-page.component';
import { TablePageComponent } from './pages/table-page/table-page.component';
import { MaskDirective } from './pages/table-page/directives/mask.directive';

const STATES = [
  { name: 'hello', url: '/hello', component: HelloPageComponent },
  { name: 'table', url: '/table', component: TablePageComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HelloPageComponent,
    TablePageComponent,
    MaskDirective
  ],
  imports: [
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    UIRouterModule.forRoot({states: STATES}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
