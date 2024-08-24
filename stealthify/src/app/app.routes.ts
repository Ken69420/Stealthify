import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';


export const routes: Routes = [
    { path: '', component: LoginComponent },  // Default route to login
    { path: 'homepage', component: HomepageComponent },  // Route to homepage
    { path: '**', redirectTo: '', pathMatch: 'full' },  // Redirect unknown paths to login
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}