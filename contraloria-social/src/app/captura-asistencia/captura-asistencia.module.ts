import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { CapturaAsistenciaPage } from './captura-asistencia.page';

const routes: Routes = [
  {
    path: '',
    component: CapturaAsistenciaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CapturaAsistenciaPage]
})
export class CapturaAsistenciaPageModule {}
