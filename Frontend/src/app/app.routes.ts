import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { AuthGuard } from './guards/auth.guard';
import { QuienesSomosComponent } from './componentes/quienes-somos/quienes-somos.component';
import { FAQComponent } from './componentes/faq/faq.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { SolicitarcodigoComponent } from './componentes/solicitarcodigo/solicitarcodigo.component';
import { RecuperarpassComponent } from './componentes/recuperarpass/recuperarpass.component';
import { ActivarComponent } from './componentes/activar/activar.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { DetailComponent } from './pages/detail/detail.component';
import { MascotasComponent } from './pages/mascotas/mascotas.component';
export const routes: Routes = [
  {path: '',component: HomeComponent,pathMatch: 'full',title: 'PetsConnect',},
  //Login/rest password
  {path: 'login', component: LoginComponent, pathMatch: 'full' },
  {path: 'solicitarcodigo',component: SolicitarcodigoComponent,pathMatch: 'full',},
  {path: 'recuperarpass',component: RecuperarpassComponent,pathMatch: 'full', },
  //Activacion de cuenta
  {path: 'activar/:email/:azar',component: ActivarComponent,pathMatch: 'full',},
  { path: 'registro', component: RegistroComponent, pathMatch: 'full' },
  //seccion del administrador
  { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
  {path: 'usuarios',component: UsuariosComponent,pathMatch: 'full',canActivate: [AuthGuard],},
  { path: 'quienessomos', component: QuienesSomosComponent, pathMatch: 'full' },
  { path: 'faq', component: FAQComponent, pathMatch: 'full' },
  {path: 'mascotas-perdidas',component: MascotasComponent,pathMatch: 'full',},
  //PerfilUsuario
  { path: 'perfil', component: PerfilComponent, pathMatch: 'full' },
  //detalle mascota
  { path: 'detalle/:id', component: DetailComponent },
];
