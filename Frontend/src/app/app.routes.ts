import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';

export const routes: Routes = [

    {path:"",component:HomeComponent,pathMatch:"full",title:"PetsConnect"},
    {path:"login",component:LoginComponent,pathMatch:"full"}
];
