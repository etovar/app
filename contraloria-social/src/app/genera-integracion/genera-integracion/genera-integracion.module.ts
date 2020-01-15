import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GeneraIntegracionPage } from './genera-integracion.page';

const routes: Routes = [
  {
    path: '',
    component: GeneraIntegracionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GeneraIntegracionPage]
})
export class GeneraIntegracionPageModule {}
