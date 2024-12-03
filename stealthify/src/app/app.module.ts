import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AnonymizationComponent } from './anonymization/anonymization.component';
import { HttpClientModule } from '@angular/common/http';
import { MonitorComponent } from './monitor/monitor.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // Add FormsModule here
    HttpClientModule,
    MonitorComponent,
  ],
  providers: [],
})
export class AppModule {}
