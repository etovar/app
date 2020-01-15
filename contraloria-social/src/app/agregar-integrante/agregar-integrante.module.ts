import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarIntegrantePage } from './agregar-integrante.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarIntegrantePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AgregarIntegrantePage]
})
export class AgregarIntegrantePageModule {}
