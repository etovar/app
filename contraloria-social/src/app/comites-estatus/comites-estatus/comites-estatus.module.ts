import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComitesEstatusPage } from './comites-estatus.page';

const routes: Routes = [
  {
    path: '',
    component: ComitesEstatusPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ComitesEstatusPage]
})
export class ComitesEstatusPageModule {}
