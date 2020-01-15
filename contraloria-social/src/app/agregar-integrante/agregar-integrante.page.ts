import { Component, OnInit } from '@angular/core';
import { FirmaModalPage } from '../modal/firma-modal/firma-modal.page';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MenuController, ModalController, Platform, NavController } from '@ionic/angular';
import { BdService } from '../services/bd/bd.service';

@Component({
  selector: 'app-agregar-integrante',
  templateUrl: './agregar-integrante.page.html',
  styleUrls: ['./agregar-integrante.page.scss'],
})
export class AgregarIntegrantePage implements OnInit {
  obra: any;
  comite: any;
  nombre: any;
  nombreIntegrante: any;
  curp: any;
  correo: any;
  firma: any;
  tipo: any;
  cargo: any;
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
  edad: any;
  genero: any;
  domicilio: any;
  telefono: any;
  materialEntregado: any;
  fechaEnRango: any;
  moduloOrigen:any;
  agendaFecha: any;
  // tslint:disable-next-line:max-line-length
  constructor(private database: BdService, private formBuilder: FormBuilder, public navCtrl: NavController, public modalController: ModalController, private plt: Platform, private location: Location, private menu: MenuController, public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.menu.enable(true, 'customComite');
    this.menu.close();
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.obra = queryParams.obra;
      this.nombre = this.obra;
      this.comite = queryParams.comite;
      this.tipo = queryParams.tipo;
      this.participante = queryParams.participante;
      this.cargo = queryParams.cargo;
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
        nombreIntegrante: ['', [Validators.required]],
        domicilio: ['', [Validators.required]],
        telefono: ['', [Validators.required]],
        cargo: ['', [Validators.required]],
        edad: ['', [Validators.required]],
        genero: ['', [Validators.required]],
        materialEntregado: ['', [Validators.required]],
        curp: ['', []],
        correo: ['', []]
    }, {});

    if (this.participante) {
      this.database.GetIntegranteCapacitacionDetalle(this.idobra, this.idcomite, this.userid, this.participante).then((data) => {
        this.edad = data[0].edad;
        this.genero = data[0].genero;
        this.nombreIntegrante = data[0].nombre;
        this.domicilio = data[0].domicilio;
        this.telefono = data[0].telefono;
        this.cargo = data[0].cargo;
        this.materialEntregado = data[0].materialEntregado;
        this.firma = data[0].firma;
        this.curp = data[0].curp;
        this.correo = data[0].correo;
      });
    }
  }

  async firmar() {
    const modal = await this.modalController.create({
      component: FirmaModalPage,
      componentProps: {
        // tslint:disable-next-line:object-literal-shorthand
        tituloModal: 'Integrante'
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        this.firma = data.data;
    });
    return await modal.present();
  }

  changeSelect(value: any) {
    this.materialEntregado = value.materialEntregado;
  }

  changeRadio(value: any) {
    this.cargo = value.cargo;
    this.genero = value.genero;
  }

  guardar(value: any) {
    if (this.participante) {
      // tslint:disable-next-line:max-line-length
      this.database.ActualizarIntegranteCapacitacion(this.participante, value.edad, value.genero, value.nombreIntegrante, value.domicilio, value.telefono, value.cargo, value.materialEntregado, this.firma, this.idobra, this.idcomite, this.userid, this.curp, this.correo);
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
      this.database.GuardarIntegranteCapacitacion(value.edad, value.genero, value.nombreIntegrante, value.domicilio, value.telefono, value.cargo, value.materialEntregado, this.firma, this.idobra, this.idcomite, this.userid, this.curp, this.correo);
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
