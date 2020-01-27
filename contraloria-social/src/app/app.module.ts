import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Network } from '@ionic-native/network/ngx';
import { FichaModalPage } from './modal/ficha-modal/ficha-modal.page';
import { DocsComitePage } from './modal/docs-comite/docs-comite.page';
import { FirmaModalPage } from './modal/firma-modal/firma-modal.page';
import { ImagenModalPage } from './modal/imagen-modal/imagen-modal.page';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SignaturePadModule } from 'angular2-signaturepad';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DatePipe } from '@angular/common';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';

@NgModule({
  declarations: [AppComponent, FichaModalPage, DocsComitePage, ImagenModalPage, FirmaModalPage],
  entryComponents: [FichaModalPage, DocsComitePage, ImagenModalPage, FirmaModalPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, ReactiveFormsModule, SignaturePadModule,
  HttpClientModule, IonicStorageModule.forRoot(),
  IonicStorageModule.forRoot({
    name: '__mydb',
    driverOrder: ['sqlite', 'indexeddb', 'websql', 'localstorage']
  })],
  providers: [
    StatusBar,
    SQLite,
    SplashScreen,
    ScreenOrientation,
    Network,
    FichaModalPage,
    DocsComitePage,
    ImagenModalPage,
    FirmaModalPage,
    DatePipe,
    FileOpener,
    File,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Camera, Geolocation
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
