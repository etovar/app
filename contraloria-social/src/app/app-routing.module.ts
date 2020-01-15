import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'ficha-modal', loadChildren: './modal/ficha-modal/ficha-modal.module#FichaModalPageModule' },
  { path: 'comites', loadChildren: './comites/comites.module#ComitesPageModule' },
  { path: 'docs-comite', loadChildren: './modal/docs-comite/docs-comite.module#DocsComitePageModule' },
  { path: 'evidencias', loadChildren: './evidencias/evidencias.module#EvidenciasPageModule' },
  { path: 'imagen-modal', loadChildren: './modal/imagen-modal/imagen-modal.module#ImagenModalPageModule' },
  { path: 'captura-asistencia', loadChildren: './captura-asistencia/captura-asistencia.module#CapturaAsistenciaPageModule' },
  { path: 'captura-integracion', loadChildren: './captura-integracion/captura-integracion.module#CapturaIntegracionPageModule' },
  { path: 'captura-capacitacion', loadChildren: './captura-capacitacion/captura-capacitacion.module#CapturaCapacitacionPageModule' },
  { path: 'agregar-asistente', loadChildren: './agregar-asistente/agregar-asistente.module#AgregarAsistentePageModule' },
  { path: 'firma-modal', loadChildren: './modal/firma-modal/firma-modal.module#FirmaModalPageModule' },
  { path: 'agregar-testigo', loadChildren: './agregar-testigo/agregar-testigo.module#AgregarTestigoPageModule' },
  { path: 'agregar-integrante', loadChildren: './agregar-integrante/agregar-integrante.module#AgregarIntegrantePageModule' },
  { path: 'agregar-participante', loadChildren: './agregar-participante/agregar-participante.module#AgregarParticipantePageModule' },
  { path: 'comites-estatus', loadChildren: './comites-estatus/comites-estatus/comites-estatus.module#ComitesEstatusPageModule' },
  { path: 'genera-integracion', loadChildren: './genera-integracion/genera-integracion/genera-integracion.module#GeneraIntegracionPageModule' },
  { path: 'genera-capacitacion', loadChildren: './genera-capacitacion/genera-capacitacion/genera-capacitacion.module#GeneraCapacitacionPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
