import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { EnvironmentService } from './services/enviroment.service';
import { API_BASE_URL } from './services/api.service';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [
    {
      provide: API_BASE_URL,
      deps: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) =>
        environmentService.apiBaseUrl
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
