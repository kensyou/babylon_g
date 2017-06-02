import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { Building3dComponent } from './building3d/building3d.component';
import { ResizeService } from './services/resize.service';
import { DataService } from './services/data.service';

@NgModule({
  declarations: [
    AppComponent,
    Building3dComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule,
    FlexLayoutModule
  ],
  providers: [ResizeService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
