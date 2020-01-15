import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FotoService } from '../services/foto/foto.service';
import { ModalController, Platform } from '@ionic/angular';
import { ImagenModalPage } from '../modal/imagen-modal/imagen-modal.page';
import { Location } from '@angular/common';
import { LoadingController } from '@ionic/angular';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-evidencias',
  templateUrl: './evidencias.page.html',
  styleUrls: ['./evidencias.page.scss'],
})
export class EvidenciasPage implements OnInit {
  obra: any;
  comite: any;
  modulo: any;
  accion: any;
  tipo: any;
  idcomite: any;
  obraid: any;
  userid: any;
  idlocal: any;
  descripcion: any;
  tipofondo: any;
  module: any;
  action: any;
  normativaNombre: any;
  metodoContraloria: any;
  fechaAgenda: any;
  fechaHoy: any;
  fechaEnRango: any;
  moduloOrigen: any;
  sliderOpts = {
    zoom: false,
    slidesPerView: 1.5,
    spaceBetween: 20,
    centeredSlides: true
  };
  // tslint:disable-next-line:max-line-length
  constructor(private datePipe: DatePipe, private loadingController: LoadingController, private plt: Platform, private location: Location, private modalController: ModalController, public navCtrl: NavController, private fotoService: FotoService, private camera: Camera, public activatedRoute: ActivatedRoute, private menu: MenuController, public appComp: AppComponent) {
    /*this.plt.backButton.subscribe(() => {
    this.location.back();
    });*/
  }

  ngOnInit() {
    this.menu.enable(true, 'customComite');
    this.menu.close();
    this.activatedRoute.queryParams.subscribe(queryParams => {
    this.obra = queryParams.obra;
    this.comite = queryParams.comite;
    this.modulo = queryParams.modulo;
    this.accion = queryParams.accion;
    this.appComp.obra = this.obra;
    this.tipo = queryParams.tipo;
    this.obraid = queryParams.obraid;
    this.idcomite = queryParams.idcomite;
    this.userid = queryParams.userid;
    this.idlocal = queryParams.idlocal;
    this.descripcion = queryParams.descripcion;
    this.tipofondo = queryParams.tipofondo;
    this.module = queryParams.module;
    this.action = queryParams.action;
    this.normativaNombre = queryParams.normativaNombre;
    this.metodoContraloria = queryParams.metodoContraloria;
    this.fechaAgenda = queryParams.fechaAgenda;
    this.fechaEnRango = queryParams.fechaEnRango;
    this.moduloOrigen = queryParams.moduloOrigen;
  });
    // this.fotoService.ObtenerFotos(this.module, this.action, this.obraid, this.idcomite, this.userid);
    this.presentLoading();
  }

  regresar() {
    if (this.moduloOrigen === 'comiteAgenda') {
      this.navCtrl.navigateRoot('comites-estatus', {
        queryParams: {
           nombre: this.obra,
           comite: this.comite,
           tipo: this.tipo,
           idobra: this.obraid,
           descripcion: this.descripcion,
           idlocal: this.idlocal,
           idusuario: this.userid,
           idcomite: this.idcomite,
           tipofondo: this.tipofondo,
           normativaNombre: this.normativaNombre,
           metodoContraloria: this.metodoContraloria,
           fechaEnRangoParam: this.fechaEnRango,
           agendaFecha: this.fechaAgenda,
           moduloOrigen: this.moduloOrigen
        }
     });
    }
    if (this.moduloOrigen === 'comiteObra') {
      this.navCtrl.navigateRoot('comites', {
        queryParams: {
           nombre: this.obra,
           comite: this.comite,
           tipo: this.tipo,
           idobra: this.obraid,
           descripcion: this.descripcion,
           idlocal: this.idlocal,
           idusuario: this.userid,
           idcomite: this.idcomite,
           tipofondo: this.tipofondo,
           normativaNombre: this.normativaNombre,
           metodoContraloria: this.metodoContraloria,
           fechaEnRangoParam: this.fechaEnRango,
           agendaFecha: this.fechaAgenda,
           moduloOrigen: this.moduloOrigen
        }
     });
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando.....',
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }

  openPreview(img, modulo, accion, idobra, idcomite, idusuario) {
    this.modalController.create({
      component: ImagenModalPage,
      componentProps: {
        // tslint:disable-next-line:object-literal-shorthand
        img: img,
        // tslint:disable-next-line:object-literal-shorthand
        modulo: modulo,
        // tslint:disable-next-line:object-literal-shorthand
        accion: accion,
        // tslint:disable-next-line:object-literal-shorthand
        idobra: idobra,
        // tslint:disable-next-line:object-literal-shorthand
        idcomite: idcomite,
        // tslint:disable-next-line:object-literal-shorthand
        idusuario: idusuario
      }
    }).then(modal => {
      modal.present();
    });
  }
}
