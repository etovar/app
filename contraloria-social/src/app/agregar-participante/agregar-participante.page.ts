import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController, ModalController, Platform, NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { FirmaModalPage } from '../modal/firma-modal/firma-modal.page';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BdService } from '../services/bd/bd.service';

@Component({
  selector: 'app-agregar-participante',
  templateUrl: './agregar-participante.page.html',
  styleUrls: ['./agregar-participante.page.scss'],
})
export class AgregarParticipantePage implements OnInit {
  obra: any;
  comite: any;
  nombre: any;
  genero: any;
  edad: any;
  curp: any;
  firma: any;
  tipo: any;
  participante: any;
  agregarForm: FormGroup;
  tipofondo: any;
  idobra: any;
  descripcion: any;
  idlocal: any;
  userid: any;
  idcomite: any;
  normativaNombre: any;
  metodoContraloria: any;
  nombreParticipante: any;
  fechaEnRango: any;
  moduloOrigen: any;
  agendaFecha: any;
  dependencia: any;
  cargo: any;
  // tslint:disable-next-line:max-line-length
  constructor(private database: BdService, private formBuilder: FormBuilder, public navCtrl: NavController, public modalController: ModalController, private plt: Platform, private location: Location, private menu: MenuController, public activatedRoute: ActivatedRoute) {
    /*this.plt.backButton.subscribe(() => {
    this.location.back();
  });*/
  }

  ngOnInit() {
    this.menu.enable(true, 'customComite');
    this.menu.close();
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.obra = queryParams.obra;
      this.nombre = this.obra;
      this.comite = queryParams.comite;
      this.tipo = queryParams.tipo;
      this.participante = queryParams.participante;
      this.tipofondo = queryParams.tipofondo;
      this.idobra = queryParams.idobra;
      this.descripcion = queryParams.descripcion;
      this.idlocal = queryParams.idlocal;
      this.userid = queryParams.userid;
      this.idcomite = queryParams.idcomite;
      this.normativaNombre = queryParams.normativaNombre;
      this.metodoContraloria = queryParams.metodoContraloria;
      this.fechaEnRango = queryParams.fechaEnRango;
      this.moduloOrigen = queryParams.moduloOrigen;
      this.agendaFecha = queryParams.agendaFecha;
    });
    this.agregarForm = this.formBuilder.group({
        nombreParticipante: ['', [Validators.required]],
        dependencia: ['', [Validators.required]],
        genero: ['', [Validators.required]],
        edad: ['', [Validators.required]],
        curp: ['', []],
        cargo: ['', [Validators.required]]
    }, {});

    if (this.participante) {
      this.database.GetParticipanteCapacitacionDetalle(this.idobra, this.idcomite, this.userid, this.participante).then((data) => {
        this.nombreParticipante = data[0].nombre;
        this.dependencia = data[0].dependencia;
        this.firma = data[0].firma;
        this.genero = data[0].genero;
        this.edad = data[0].edad;
        this.curp = data[0].curp;
        this.cargo = data[0].cargo;
      });
    }
  }

  changeRadio(value: any) {
    this.genero = value.genero;
  }

  async firmar() {
    const modal = await this.modalController.create({
      component: FirmaModalPage,
      componentProps: {
        // tslint:disable-next-line:object-literal-shorthand
        tituloModal: 'Participante'
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        this.firma = data.data;
    });
    return await modal.present();
  }

  guardar(value: any) {
    if (this.participante) {
      // tslint:disable-next-line:max-line-length
      this.database.ActualizarParticipanteCapacitacion(value.nombreParticipante, value.dependencia, this.firma, this.idobra, this.idcomite, this.userid, this.participante, value.genero, value.edad, value.curp, value.cargo);
      this.navCtrl.navigateRoot('captura-capacitacion', {
      queryParams: {
         obra: this.obra,
         comite: this.comite,
         tipo: this.tipo,
         tipofondo: this.tipofondo,
         obraid: this.idobra,
         descripcion: this.descripcion,
         idlocal: this.idlocal,
         userid: this.userid,
         idcomite: this.idcomite,
         normativaNombre: this.normativaNombre,
         metodoContraloria: this.metodoContraloria,
         fechaEnRango: this.fechaEnRango,
         moduloOrigen: this.moduloOrigen,
         fechaAgenda: this.agendaFecha
      }
   });
    } else {
      // tslint:disable-next-line:max-line-length
      this.database.GuardarParticipanteCapacitacion(value.nombreParticipante, value.dependencia, this.firma, this.idobra, this.idcomite, this.userid, value.genero, value.edad, value.curp, value.cargo);
      this.navCtrl.navigateRoot('captura-capacitacion', {
      queryParams: {
         obra: this.obra,
         comite: this.comite,
         tipo: this.tipo,
         tipofondo: this.tipofondo,
         obraid: this.idobra,
         descripcion: this.descripcion,
         idlocal: this.idlocal,
         userid: this.userid,
         idcomite: this.idcomite,
         normativaNombre: this.normativaNombre,
         metodoContraloria: this.metodoContraloria,
         fechaEnRango: this.fechaEnRango,
         moduloOrigen: this.moduloOrigen,
         fechaAgenda: this.agendaFecha
      }
   });
    }
}

regresar() {
  this.navCtrl.navigateRoot('captura-capacitacion', {
    queryParams: {
       obra: this.obra,
       comite: this.comite,
       tipo: this.tipo,
       tipofondo: this.tipofondo,
       obraid: this.idobra,
       descripcion: this.descripcion,
       idlocal: this.idlocal,
       userid: this.userid,
       idcomite: this.idcomite,
       normativaNombre: this.normativaNombre,
       metodoContraloria: this.metodoContraloria,
       fechaEnRango: this.fechaEnRango,
       moduloOrigen: this.moduloOrigen,
       fechaAgenda: this.agendaFecha
    }
 });
}
}
