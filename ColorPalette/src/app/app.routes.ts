import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { CreatePageComponent } from './create-page/create-page.component';

export const routes: Routes = [
    {path: '', redirectTo:'explore', pathMatch: 'full'},
    {path: 'explore', component: MainPageComponent, title: 'Explore'},
    {path: 'create', component: CreatePageComponent, title: 'Create'},
];
