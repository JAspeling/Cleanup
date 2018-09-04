import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TreeviewComponent } from '../components/treeview/treeview';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../services/httpService';
import { TestComponent } from '../components/test/test.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { ToastrModule } from 'ngx-toastr';
import { LoaderComponent } from '../components/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    TreeviewComponent,
    TestComponent,
    LoaderComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers })
  ],
  providers: [ ApiService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
