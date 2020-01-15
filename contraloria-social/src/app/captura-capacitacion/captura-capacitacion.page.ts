import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, ModalController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FirmaModalPage } from '../modal/firma-modal/firma-modal.page';
import { BdService } from '../services/bd/bd.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-captura-capacitacion',
  templateUrl: './captura-capacitacion.page.html',
  styleUrls: ['./captura-capacitacion.page.scss'],
})
export class CapturaCapacitacionPage implements OnInit {
  obra: any;
  comite: any;
  nombre: any;
  capturarForm: FormGroup;
  public rows2: any;
  public rows: any;
  public nombreAsignado: any;
  firmaAsignado: any;
  tipo: any;
  presidente: any;
  idpresidente: any;
  secretario: any;
  idsecretario: any;
  tesorero: any;
  idtesorero: any;
  idcomite: any;
  obraid: any;
  userid: any;
  idlocal: any;
  descripcion: any;
  tipofondo: any;
  normativaNombre: any;
  metodoContraloria: any;
  pregunta1: any;
  pregunta2: any;
  pregunta3: any;
  pregunta4: any;
  pregunta5: any;
  pregunta6: any;
  constituyo: any;
  observaciones: any;
  fechaEnRango: any;
  moduloOrigen: any;
  fechaAgenda: any;
  // tslint:disable-next-line:max-line-length
  constructor(public alert: AlertController, public modalController: ModalController, public activatedRoute: ActivatedRoute, public appComp: AppComponent, private formBuilder: FormBuilder, private menu: MenuController, public navCtrl: NavController, public database: BdService) { }

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
      constituyo: ['', [Validators.required]],
      observaciones: ['', [Validators.required]],
      pregunta1: ['', [Validators.required]],
      pregunta2: ['', [Validators.required]],
      pregunta3: ['', [Validators.required]],
      pregunta4: ['', [Validators.required]],
      pregunta5: ['', [Validators.required]],
      pregunta6: ['', [Validators.required]]
    }, {});
    this.nombreAsignado = this.appComp.nombre;

    this.cargarParticipantes();
    this.database.GetIntegrantesCapacitacion(this.obraid, this.idcomite, this.userid);
    this.cargarIntegrantes();
    this.cargarCapturaCapacitacion();
  }

  cargarCapturaCapacitacion() {
    this.database.GetCapturaCapacitacion(this.obraid, this.idcomite, this.userid).then((data) => {
      if (data[0]) {
        this.constituyo = data[0].constituyo;
        if (data[0].observaciones) {
          this.observaciones = data[0].observaciones;
        } else {
          this.observaciones = '';
        }
        this.pregunta1 = data[0].pregunta1;
        this.pregunta2 = data[0].pregunta2;
        this.pregunta3 = data[0].pregunta3;
        this.pregunta4 = data[0].pregunta4;
        this.pregunta5 = data[0].pregunta5;
        this.pregunta6 = data[0].pregunta6;
        this.firmaAsignado = data[0].firmaAsignado;
      }
    });
  }

  onChangeForm(value: any, elemento: any) {
    if (elemento === 'pregunta1') {
      this.pregunta1 = value.detail.value;
    }
    if (elemento === 'pregunta2') {
      this.pregunta2 = value.detail.value;
    }
    if (elemento === 'pregunta3') {
      this.pregunta3 = value.detail.value;
    }
    if (elemento === 'pregunta4') {
      this.pregunta4 = value.detail.value;
    }
    if (elemento === 'pregunta5') {
      this.pregunta5 = value.detail.value;
    }
    if (elemento === 'pregunta6') {
      this.pregunta6 = value.detail.value;
    }
    if (elemento === 'constituyo') {
      this.constituyo = value.detail.value;
    }
    // tslint:disable-next-line:max-line-length
    this.database.GuardarCapacitacionComite(this.constituyo, this.observaciones, this.pregunta1, this.pregunta2, this.pregunta3, this.pregunta4, this.pregunta5, this.pregunta6, this.firmaAsignado, this.obraid, this.idcomite, this.userid, this.firmaAsignado);
  }

  cargarParticipantes() {
    this.database.GetTestigosCapacitacion(this.obraid, this.idcomite, this.userid);
  }

  cargarIntegrantes() {
    this.database.GetIntegrantesCapacitacionPresidente(this.obraid, this.idcomite, this.userid).then((data) => {
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

  guardar() {
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

  async firmarAsignado() {
    const modal = await this.modalController.create({
      component: FirmaModalPage,
      componentProps: {
        // tslint:disable-next-line:object-literal-shorthand
        tituloModal: 'Dependencia Normativa'
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        this.firmaAsignado = data.data;
        // tslint:disable-next-line:max-line-length
        this.database.GuardarCapacitacionComite(this.constituyo, this.observaciones, this.pregunta1, this.pregunta2, this.pregunta3, this.pregunta4, this.pregunta5, this.pregunta6, data.data, this.obraid, this.idcomite, this.userid, data.data);
    });
    return await modal.present();
  }

  agregarParticipante(value: any) {
    this.navCtrl.navigateRoot('agregar-participante', {
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

  agregar(value: any) {
    this.navCtrl.navigateRoot('agregar-integrante', {
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
          this.database.BorrarIntegranteCapacitacion(id);
          this.database.GetIntegrantesCapacitacion(this.obraid, this.idcomite, this.userid);
          this.presidente = this.secretario = this.tesorero = this.idpresidente = this.idsecretario = this.idtesorero = null;
          this.cargarIntegrantes();
        }
      }
    ]
  });
    await alertBorrar.present();
  }

  editIntegrante(idIntegrante: any, cargo: any) {
    this.navCtrl.navigateRoot('agregar-integrante', {
      queryParams: {
        obra: this.obra,
        comite: this.comite,
        tipo: this.tipo,
        participante: idIntegrante,
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

  editParticipante(participante: any) {
    this.navCtrl.navigateRoot('agregar-participante', {
      queryParams: {
        obra: this.obra,
        comite: this.comite,
        tipo: this.tipo,
        // tslint:disable-next-line:object-literal-shorthand
        participante: participante,
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

  async borrarParticipante(participante: any) {
    const alertBorrar = await this.alert.create({
    header: 'SICSEQ',
    backdropDismiss: false,
    message: '¿Desea borrar el participante?',
    buttons: [
      {
        text: 'No',
        role: 'cancel'
      },
      {
        text: 'Si',
        handler: () => {
          this.database.BorrarParticipanteCapacitacion(participante);
          this.cargarParticipantes();
        }
      }
    ]
  });
    await alertBorrar.present();
  }

  editPresidente(participante: any) {
    this.navCtrl.navigateRoot('agregar-integrante', {
      queryParams: {
        obra: this.obra,
        comite: this.comite,
        tipo: this.tipo,
        // tslint:disable-next-line:object-literal-shorthand
        participante: participante,
        cargo: 'Presidente',
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

  editSecretario(participante: any) {
    this.navCtrl.navigateRoot('agregar-integrante', {
      queryParams: {
        obra: this.obra,
        comite: this.comite,
        tipo: this.tipo,
        // tslint:disable-next-line:object-literal-shorthand
        participante: participante,
        cargo: 'Secretario',
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

  editTesorero(participante: any) {
    this.navCtrl.navigateRoot('agregar-integrante', {
      queryParams: {
        obra: this.obra,
        comite: this.comite,
        tipo: this.tipo,
        // tslint:disable-next-line:object-literal-shorthand
        participante: participante,
        cargo: 'Tesorero',
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
}
