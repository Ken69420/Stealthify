import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PrivilegesComponent } from './privileges/privileges.component';
import { SettingsComponent } from './settings/settings.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { SupportComponent } from './support/support.component';


export const routes: Routes = [
    { path: '', component: LoginComponent },  // Default route to login
    { path: 'homepage', component: HomepageComponent },  // Route to homepage
    { path: 'activity', component: HomepageComponent}, //Route to Activity page
    { path: 'privileges', component: PrivilegesComponent}, //Route to Privileges page
    { path: 'settings', component: SettingsComponent}, //Route to Settings page
    { path: 'documentation', component: DocumentationComponent} , //Route to Documentation page
    { path: 'support', component: SupportComponent}, // Route to Settings page
    { path: '**', redirectTo: '', pathMatch: 'full' },  // Redirect unknown paths to login
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}