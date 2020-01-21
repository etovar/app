import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController, ModalController, Platform, NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { FirmaModalPage } from '../modal/firma-modal/firma-modal.page';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BdService } from '../services/bd/bd.service';


@Component({
  selector: 'app-agregar-asistente',
  templateUrl: './agregar-asistente.page.html',
  styleUrls: ['./agregar-asistente.page.scss'],
})
export class AgregarAsistentePage implements OnInit {
  obra: any;
  comite: any;
  nombre: any;
  domicilio: any;
  telefono: any;
  edad: any;
  genero: any;
  curp: any;
  correo: any;
  cargo: any;
  cargoSelected: any;
  firma: any;
  agregarForm: FormGroup;
  tipo: any;
  participante: any;
  tipofondo: any;
  idobra: any;
  descripcion: any;
  idlocal: any;
  userid: any;
  idcomite: any;
  normativaNombre: any;
  metodoContraloria: any;
  fechaEnRango: any;
  moduloOrigen: any;
  agendaFecha: any;
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
        nombre: ['', [Validators.required]],
        domicilio: ['', [Validators.required]],
        telefono: ['', []],
        cargo: ['', [Validators.required]],
        genero: ['', [Validators.required]],
        edad: ['', [Validators.required]],
        curp: ['', []],
        correo: ['', []]
    }, {});
    if (this.participante) {
      this.database.GetAsistenteIntegracionDetalle(this.idobra, this.idcomite, this.userid, this.participante).then((data) => {
        this.nombre = data[0].nombre;
        this.firma = data[0].firma;
        this.domicilio = data[0].domicilio;
        this.telefono = data[0].telefono;
        this.cargo = data[0].cargo;
        this.cargoSelected = data[0].cargo;
        this.genero = data[0].genero;
        this.edad = data[0].edad;
        this.curp = data[0].curp;
        this.correo = data[0].correo;
        console.log(data[0].genero);
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
    this.cargo = value.cargo;
  }

  changeRadio(value: any) {
    this.genero = value.genero;
  }

  guardar(value: any) {
    if (this.participante) {
      // tslint:disable-next-line:max-line-length
      this.database.ActualizarIntegranteIntegracion(this.participante, value.nombre, value.domicilio, value.telefono, value.cargo, this.firma, this.idobra, this.idcomite, this.userid, value.genero, value.edad, value.curp, value.correo);
      this.navCtrl.navigateRoot('captura-integracion', {
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
    this.database.GuardarIntegranteIntegracion(value.nombre, value.domicilio, value.telefono, value.cargo, this.firma, this.idobra, this.idcomite, this.userid, value.genero, value.edad, value.curp, value.correo);
    this.navCtrl.navigateRoot('captura-integracion', {
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
    this.navCtrl.navigateRoot('captura-integracion', {
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
