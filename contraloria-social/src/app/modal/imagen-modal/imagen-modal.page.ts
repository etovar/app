import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { FotoService } from '../../services/foto/foto.service';

@Component({
  selector: 'app-imagen-modal',
  templateUrl: './imagen-modal.page.html',
  styleUrls: ['./imagen-modal.page.scss'],
})
export class ImagenModalPage implements OnInit {

  @ViewChild('slider', { read: ElementRef, static: true })slider: ElementRef;
  img: any;
  modulo: any;
  accion: any;
  idobra: any;
  idcomite: any;
  idusuario: any;

  sliderOpts = {
    zoom: {
      maxRatio: 5
    }
  };

  // tslint:disable-next-line:max-line-length
  constructor(private fotoService: FotoService, private navParams: NavParams, private modalController: ModalController) { }

  ngOnInit() {
    this.img = this.navParams.get('img');
    this.modulo = this.navParams.get('modulo');
    this.accion = this.navParams.get('accion');
    this.idobra = this.navParams.get('idobra');
    this.idcomite = this.navParams.get('idcomite');
    this.idusuario = this.navParams.get('idusuario');
  }

  zoom(zoomIn: boolean) {
    const zoom = this.slider.nativeElement.swiper.zoom;
    if (zoomIn) {
      zoom.in();
    } else {
      zoom.out();
    }
  }

  close() {
    this.modalController.dismiss();
  }

  delete() {
    this.modalController.dismiss();
    this.fotoService.deletePicture(this.img, this.modulo, this.accion, this.idobra, this.idcomite, this.idusuario);
  }
}
