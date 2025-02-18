import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { FAQComponent } from './componentes/faq/faq.component';
import { QuienesSomosComponent } from './componentes/quienes-somos/quienes-somos.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    title: 'PetsConnect',
  },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
  { path: 'usuarios', component: UsuariosComponent, pathMatch: 'full' },
  { path: 'faq', component: FAQComponent, pathMatch: 'full' },
  {
    path: 'quienes-somos',
    component: QuienesSomosComponent,
    pathMatch: 'full',
  },
];
