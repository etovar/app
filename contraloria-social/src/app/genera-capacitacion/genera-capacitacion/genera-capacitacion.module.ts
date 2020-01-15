import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GeneraCapacitacionPage } from './genera-capacitacion.page';

const routes: Routes = [
  {
    path: '',
    component: GeneraCapacitacionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GeneraCapacitacionPage]
})
export class GeneraCapacitacionPageModule {}
