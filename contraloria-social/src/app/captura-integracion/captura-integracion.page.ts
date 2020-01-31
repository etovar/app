import { Component, OnInit } from '@angular/core';
import { MenuController, Platform, NavController, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import { AppComponent } from '../app.component';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FirmaModalPage } from '../modal/firma-modal/firma-modal.page';
import { BdService } from '../services/bd/bd.service';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-captura-integracion',
  templateUrl: './captura-integracion.page.html',
  styleUrls: ['./captura-integracion.page.scss'],
})
export class CapturaIntegracionPage implements OnInit {
  obra: any;
  comite: any;
  nombre: any;
  firmaEjecutora: any;
  firmaNormativa: any;
  public rows: any;
  public rows2: any;
  tipo: any;
  idcomite: any;
  tipofondo: any;
  obraid: any;
  userid: any;
  idlocal: any;
  descripcion: any;
  capturarForm: FormGroup;
  nombreEjecutora: any;
  nombreOrganoEstatal: any;
  cargoOrganoEstatal: any;
  firmaOrganoEstatal: any;
  presidente: any;
  idpresidente: any;
  secretario: any;
  idsecretario: any;
  tesorero: any;
  idtesorero: any;
  normativaNombre: any;
  array: any[];
  metodoContraloria: any;
  nombreTestigoUno: any;
  idTestigoUno: any;
  nombreTestigoDos: any;
  idTestigoDos: any;
  contraloriaAsistenteNombre: any;
  nombreTestigoFinal: any;
  fechaEnRango: any;
  moduloOrigen: any;
  fechaAgenda: any;
  // tslint:disable-next-line:max-line-length
  constructor(private storage: Storage, public alert: AlertController, public database: BdService, public modalController: ModalController, public appComp: AppComponent, private formBuilder: FormBuilder, public activatedRoute: ActivatedRoute, private plt: Platform, private location: Location, private menu: MenuController, public navCtrl: NavController) {
    /*this.plt.backButton.subscribe(() => {
      this.location.back();
    });*/
   }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.obra = queryParams.obra;
      this.comite = queryParams.comite;
      this.nombre = queryParams.obra;
      this.appComp.obra = this.obra;
      this.tipo = queryParams.tipo;
      this.obraid = queryParams.obraid;
      this.idcomite = queryParams.idcomite;
      this.userid = queryParams.userid;
      this.idlocal = queryParams.idlocal;
      this.descripcion = queryParams.descripcion;
      this.tipofondo = queryParams.tipofondo;
      this.normativaNombre = queryParams.normativaNombre;
      this.metodoContraloria = queryParams.metodoContraloria;
      this.fechaEnRango = queryParams.fechaEnRango;
      this.moduloOrigen = queryParams.moduloOrigen;
      this.fechaAgenda = queryParams.fechaAgenda;

    });
    this.menu.enable(true, 'customComite');
    this.menu.close();
    this.capturarForm = this.formBuilder.group({
      cargoOrganoEstatal: ['', []],
      nombreOrganoEstatal: ['', []]
    }, {});

    this.storage.get('login-nombre').then(res4 => {
      if (res4) {
        this.nombreEjecutora = res4;
      }
    });

    this.cargarTestigos();
    this.database.GetIntegrantesIntegracion(this.obraid, this.idcomite, this.userid);
    this.cargarIntegrantes();
    this.cargarCapturaIntegracion();
  }

  onChangeForm(value: any, elemento: any) {
    if (elemento === 'nombreOrganoEstatal') {
      this.nombreOrganoEstatal = value.nombreOrganoEstatal;
    }
    if (elemento === 'cargoOrganoEstatal') {
      this.cargoOrganoEstatal = value.cargoOrganoEstatal;
    }
    // tslint:disable-next-line:max-line-length
    this.database.GuardarIntegracionComiteChange(this.nombreOrganoEstatal, this.cargoOrganoEstatal, this.obraid, this.idcomite, this.userid);
  }

  cargarTestigos() {
    this.nombreTestigoUno = this.nombreTestigoUno = null;
    this.idTestigoUno = this.idTestigoDos = null;
    this.database.GetTestigosIntegracion(this.obraid, this.idcomite, this.userid).then((data) => {
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < this.database.arrayTestigos.length; index++) {
        if (this.database.arrayTestigos[index].numeroTestigo === 1) {
          this.nombreTestigoUno = this.database.arrayTestigos[index].nombre;
          this.idTestigoUno = this.database.arrayTestigos[index].id;
        }
        if (this.database.arrayTestigos[index].numeroTestigo === 2) {
          this.nombreTestigoDos = this.database.arrayTestigos[index].nombre;
          this.idTestigoDos = this.database.arrayTestigos[index].id;
        }
      }
    });
    this.database.GetComiteExtraData(this.obraid, this.idcomite, this.userid).then((data) => {
      this.contraloriaAsistenteNombre = data;
      if (this.nombreTestigoUno === null) {
        this.nombreTestigoFinal = this.contraloriaAsistenteNombre;
      } else {
        this.nombreTestigoFinal = this.nombreTestigoUno;
      }
    });
  }

  cargarCapturaIntegracion() {
    this.database.GetCapturaIntegracion(this.obraid, this.idcomite, this.userid).then((data) => {
      if (data[0]) {
        this.nombreEjecutora = data[0].nombreEjecutora;
        this.normativaNombre = data[0].nombreNormativa;
        this.firmaEjecutora = data[0].firmaEjecutora;
        this.firmaNormativa = data[0].firmaNormativa;
        this.nombreOrganoEstatal = data[0].nombreOrganoEstatal;
        this.cargoOrganoEstatal = data[0].cargoOrganoEstatal;
        this.firmaOrganoEstatal = data[0].firmaOrganoEstatal;
      }
    });
  }

  cargarIntegrantes() {
    this.database.GetIntegrantesIntegracionPresidente(this.obraid, this.idcomite, this.userid).then((data) => {
      if (this.database.arrayIntegrantesPresidente.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let o = 0; o < this.database.arrayIntegrantesPresidente.length; o++) {
          if (this.database.arrayIntegrantesPresidente[o].cargo === 'Presidente') {
            this.presidente = this.database.arrayIntegrantesPresidente[o].nombre;
            this.idpresidente = this.database.arrayIntegrantesPresidente[o].id;
          }
          if (this.database.arrayIntegrantesPresidente[o].cargo === 'Secretario') {
            this.secretario = this.database.arrayIntegrantesPresidente[o].nombre;
            this.idsecretario = this.database.arrayIntegrantesPresidente[o].id;
          }
          // tslint:disable-next-line:max-line-length
          if (this.database.arrayIntegrantesPresidente[o].cargo === 'Tesorero' || this.database.arrayIntegrantesPresidente[o].cargo === 'Vocal ') {
            this.tesorero = this.database.arrayIntegrantesPresidente[o].nombre;
            this.idtesorero = this.database.arrayIntegrantesPresidente[o].id;
          }
        }
      }
    });
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
           moduloOrigen: this.moduloOrigen,
           agendaFecha: this.fechaAgenda

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
           moduloOrigen: this.moduloOrigen,
           agendaFecha: this.fechaAgenda
        }
     });
    }
  }

  agregar(value: any) {
    this.navCtrl.navigateRoot('agregar-asistente', {
      queryParams: {
        obra: this.obra,
        comite: this.comite,
        tipo: this.tipo,
        cargo: 'Vocal',
        tipofondo: this.tipofondo,
        idobra: this.obraid,
        descripcion: this.descripcion,
        idlocal: this.idlocal,
        userid: this.userid,
        idcomite: this.idcomite,
        normativaNombre: this.normativaNombre,
        metodoContraloria: this.metodoContraloria,
        fechaEnRango: this.fechaEnRango,
        moduloOrigen: this.moduloOrigen,
        agendaFecha: this.fechaAgenda
      }
    });
  }

  agregarTestigo(value: any) {
    this.navCtrl.navigateRoot('agregar-testigo', {
      queryParams: {
        obra: this.obra,
        comite: this.comite,
        tipo: this.tipo,
        tipofondo: this.tipofondo,
        idobra: this.obraid,
        descripcion: this.descripcion,
        idlocal: this.idlocal,
        userid: this.userid,
        idcomite: this.idcomite,
        normativaNombre: this.normativaNombre,
        metodoContraloria: this.metodoContraloria,
        fechaEnRango: this.fechaEnRango,
        moduloOrigen: this.moduloOrigen,
        agendaFecha: this.fechaAgenda
      }
    });
  }

  async borrarTestigo(id: any) {
    const alertBorrar = await this.alert.create({
      header: 'SICSEQ',
      backdropDismiss: false,
      message: '¿Desea borrar el testigo?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Si',
          handler: () => {
            this.database.BorrrTestigoIntegracion(id);
            if (id === 1) {
              this.nombreTestigoUno = null;
            } else {
              this.nombreTestigoDos = null;
            }
            this.cargarTestigos();
          }
        }
      ]
    });
    await alertBorrar.present();
  }

  async borrarIntegrante(id: any) {
    const alertBorrar = await this.alert.create({
    header: 'SICSEQ',
    message: '¿Desea borrar el integrante?',
    backdropDismiss: false,
    buttons: [
      {
        text: 'No',
        role: 'cancel'
      },
      {
        text: 'Si',
        handler: () => {
          this.database.BorrrIntegranteIntegracion(id);
          this.database.GetIntegrantesIntegracion(this.obraid, this.idcomite, this.userid);
          this.presidente = this.secretario = this.tesorero = this.idpresidente = this.idsecretario = this.idtesorero = null;
          this.cargarIntegrantes();
        }
      }
    ]
  });
    await alertBorrar.present();
  }

  editIntegrante(idParticipante: any, cargo: any) {
    this.navCtrl.navigateRoot('agregar-asistente', {
      queryParams: {
        obra: this.obra,
        comite: this.comite,
        tipo: this.tipo,
        // tslint:disable-next-line:object-literal-shorthand
        participante: idParticipante,
        tipofondo: this.tipofondo,
        idobra: this.obraid,
        descripcion: this.descripcion,
        idlocal: this.idlocal,
        userid: this.userid,
        idcomite: this.idcomite,
        // tslint:disable-next-line:object-literal-shorthand
        cargo: cargo,
        normativaNombre: this.normativaNombre,
        metodoContraloria: this.metodoContraloria,
        fechaEnRango: this.fechaEnRango,
        moduloOrigen: this.moduloOrigen,
        agendaFecha: this.fechaAgenda
      }
    });
  }

  editTestigo(idParticipante: any, numeroTestigo: any, nombreDefaul: any) {
    this.navCtrl.navigateRoot('agregar-testigo', {
      queryParams: {
        obra: this.obra,
        comite: this.comite,
        tipo: this.tipo,
        // tslint:disable-next-line:object-literal-shorthand
        participante: idParticipante,
        tipofondo: this.tipofondo,
        idobra: this.obraid,
        descripcion: this.descripcion,
        idlocal: this.idlocal,
        userid: this.userid,
        idcomite: this.idcomite,
        normativaNombre: this.normativaNombre,
        metodoContraloria: this.metodoContraloria,
        // tslint:disable-next-line:object-literal-shorthand
        numeroTestigo: numeroTestigo,
        // tslint:disable-next-line:object-literal-shorthand
        nombreDefaul: nombreDefaul,
        fechaEnRango: this.fechaEnRango,
        moduloOrigen: this.moduloOrigen,
        agendaFecha: this.fechaAgenda
      }
    });
  }

  async firmarOrgano() {
    const modal = await this.modalController.create({
      component: FirmaModalPage,
      componentProps: {
        // tslint:disable-next-line:object-literal-shorthand
        tituloModal: 'Órgano Estatal de Control'
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        if (data.data !== null) {
          // tslint:disable-next-line:max-line-length
          this.database.GuardarIntegracionComiteFirmas(this.obraid, this.idcomite, this.userid, this.nombreEjecutora, null, this.normativaNombre, null, data.data);
          this.firmaOrganoEstatal = data.data;
        }
    });
    return await modal.present();
  }

  async firmarEjecutora() {
    const modal = await this.modalController.create({
      component: FirmaModalPage,
      componentProps: {
        // tslint:disable-next-line:object-literal-shorthand
        tituloModal: 'Dependencia Ejecutora'
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        if (data.data !== null) {
          // tslint:disable-next-line:max-line-length
          this.database.GuardarIntegracionComiteFirmas(this.obraid, this.idcomite, this.userid, this.nombreEjecutora, data.data, this.normativaNombre, null, null);
          this.firmaEjecutora = data.data;
        }
    });
    return await modal.present();
  }

  async firmarNormativa() {
    const modal = await this.modalController.create({
      component: FirmaModalPage,
      componentProps: {
        // tslint:disable-next-line:object-literal-shorthand
        tituloModal: 'Dependencia Normativa'
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        if (data.data !== null) {
          // tslint:disable-next-line:max-line-length
          this.database.GuardarIntegracionComiteFirmas(this.obraid, this.idcomite, this.userid, this.nombreEjecutora, null, this.normativaNombre, data.data, null);
          this.firmaNormativa = data.data;
        }
    });
    return await modal.present();
  }

  guardar() {
    // tslint:disable-next-line:max-line-length
    /*this.database.GuardarIntegracionComite(this.obraid, this.idcomite, this.userid, this.normativaNombre, this.firmaNormativa, this.nombreEjecutora, this.firmaEjecutora);
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
         normativaNombre: this.normativaNombre
      }
   });*/
  }
}
