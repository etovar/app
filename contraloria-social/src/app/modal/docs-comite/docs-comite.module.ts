import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from '../../app.component';

import { IonicModule } from '@ionic/angular';

import { DocsComitePage } from './docs-comite.page';

const routes: Routes = [
  {
    path: '',
    component: DocsComitePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppComponent,
    RouterModule.forChild(routes)
  ],
  declarations: [DocsComitePage]
})
export class DocsComitePageModule {}
