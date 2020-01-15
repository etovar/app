import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController, ModalController, Platform, NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { FirmaModalPage } from '../modal/firma-modal/firma-modal.page';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BdService } from '../services/bd/bd.service';

@Component({
  selector: 'app-agregar-testigo',
  templateUrl: './agregar-testigo.page.html',
  styleUrls: ['./agregar-testigo.page.scss'],
})
export class AgregarTestigoPage implements OnInit {
  obra: any;
  comite: any;
  nombre: any;
  firma: any;
  genero: any;
  edad: any;
  curp: any;
  correo: any;
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
  numeroTestigo: any;
  nombreDefault: any;
  fechaEnRango: any;
  moduloOrigen:any;
  agendaFecha: any;
  // tslint:disable-next-line:max-line-length
  constructor(private database: BdService, private formBuilder: FormBuilder, public navCtrl: NavController, public modalController: ModalController, private plt: Platform, private location: Location, private menu: MenuController, public activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.menu.enable(true, 'customComite');
    this.menu.close();
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.obra = queryParams.obra;
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
      this.numeroTestigo = queryParams.numeroTestigo;
      this.nombreDefault = queryParams.nombreDefaul;
      this.fechaEnRango = queryParams.fechaEnRango;
      this.moduloOrigen = queryParams.moduloOrigen;
      this.agendaFecha = queryParams.agendaFecha;
    });
    this.agregarForm = this.formBuilder.group({
        nombre: ['', [Validators.required]],
        genero: ['', [Validators.required]],
        edad: ['', [Validators.required]],
        curp: ['', []],
        correo: ['', []]
    }, {});

    if (this.participante) {
        this.database.GetTestigosIntegracionDetalle(this.idobra, this.idcomite, this.userid, this.participante).then((data) => {
        if (data[0].nombre) {
          this.nombre = data[0].nombre;
          this.genero = data[0].genero;
          this.edad = data[0].edad;
          this.curp = data[0].curp;
          this.correo = data[0].correo;
        } else {
          this.nombre = this.nombreDefault;
        }
        this.firma = data[0].firma;
      });
    } else {
      this.nombre = this.nombreDefault;
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
        tituloModal: 'Testigos'
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
      this.database.ActualizarTestigoIntegracion(this.participante, value.nombre, this.firma, this.idobra, this.idcomite, this.userid, this.genero, this.edad, this.curp, this.correo);
      this.navCtrl.navigateRoot('captura-integracion', {
        queryParams: {
           obra: this.obra,
           comite: this.comite,
           testigo: value.nombre,
           firma: this.firma,
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
    this.database.GuardarTestigoIntegracion(value.nombre, this.firma, this.idobra, this.idcomite, this.userid, this.numeroTestigo, this.genero, this.edad, this.curp, this.correo);
    this.navCtrl.navigateRoot('captura-integracion', {
    queryParams: {
       obra: this.obra,
       comite: this.comite,
       testigo: value.nombre,
       firma: this.firma,
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
