import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Building3dComponent } from './building3d/building3d.component';
import { ResizeService } from './services/resize.service';

@NgModule({
  declarations: [
    AppComponent,
    Building3dComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [ResizeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
