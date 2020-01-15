import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform, NavParams } from '@ionic/angular';
import { Location } from '@angular/common';
import { BdService } from '../../services/bd/bd.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-ficha-modal',
  templateUrl: './ficha-modal.page.html',
  styleUrls: ['./ficha-modal.page.scss'],
})
export class FichaModalPage implements OnInit {
  imagenmapa = '/assets/img/iconomapa.png';
  @Input() id: number;
  @Input() idObraLocal: number;
  @Input() name: string;
  @Input() usuario: number;
  idLocal: any;
  idObra: any;
  numObra: any;
  nombreObra: any;
  mmunicipio: any;
  localidad: any;
  statusObra: any;
  montoAprobado: any;
  fondo: any;
  ejecutora: any;
  normativa: any;
  inicioObra: any;
  terminoObra: any;
  lon: any;
  lat: any;
  urlMapa: any;

  // tslint:disable-next-line:max-line-length
  constructor(private database: BdService, public modalCtrl: ModalController, navParams: NavParams, private plt: Platform, private location: Location) {
   }

  ngOnInit() {
    this.getDetallesFicha();
  }

  getDetallesFicha() {
    this.database.GetObrasDetalles(this.idObraLocal, this.name, this.id, this.usuario).then((data) => {
    this.idLocal = data[0].idLocal;
    this.idObra = data[0].idObra;
    this.numObra = data[0].numObra;
    this.nombreObra = data[0].nombreObra;
    this.mmunicipio = data[0].mmunicipio;
    this.localidad = data[0].localidad;
    this.statusObra = data[0].statusObra;
    this.montoAprobado = data[0].montoAprobado;
    this.fondo = data[0].fondo;
    this.ejecutora = data[0].ejecutora;
    this.normativa = data[0].normativa;
    this.inicioObra = data[0].inicioObra;
    this.terminoObra = data[0].terminoObra;
    this.lon = data[0].lon;
    this.lat = data[0].lat;
    this.urlMapa = 'http://www.google.com/maps/place/' + this.lat + ',' + this.lon;
    }, (error) => {
      console.log(error);
    });
  }

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }
}
