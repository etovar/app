import { Component, Input, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { Location } from '@angular/common';
import { ModalController, Platform, NavController } from '@ionic/angular';
import { FotoService } from '../../services/foto/foto.service';
import { BdService } from '../../services/bd/bd.service';
import { AlertController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-docs-comite',
  templateUrl: './docs-comite.page.html',
  styleUrls: ['./docs-comite.page.scss'],
})
export class DocsComitePage implements OnInit {
  @Input() id: number;
  @Input() obra: string;
  @Input() comite: string;
  @Input() tipo: string;
  @Input() userid: string;
  @Input() obraid: string;
  @Input() idcomite: string;
  @Input() descripcion: string;
  @Input() idlocal: string;
  @Input() tipofondo: string;
  @Input() rol: string;
  @Input() normativaNombre: string;
  @Input() metodoContraloria: string;
  @Input() metodoIntegracion: any;
  @Input() metodoCapacitacion: any;
  @Input() fechaHoy: any;
  @Input() fechaAgenda: any;
  @Input() moduloOrigen: any;
  tipoContraloria: string;
  habilitado: any;
  checkValue: any;
  listaAsistenciaStatus: any;
  integracionStatus: any;
  integracionEvidenciaStatus: any;
  capacitacionStatus: any;
  capacitacionEvidenciaStatus: any;
  evidenciaComiteStatus: any;
  fechaEnRango: any;
  fechaEnRangoParam: any;

  // tslint:disable-next-line:max-line-length
  constructor(public activatedRoute: ActivatedRoute, private datePipe: DatePipe, private changeDetector: ChangeDetectorRef, public alert: AlertController, private database: BdService, private fotoService: FotoService, public navCtrl: NavController, public modalCtrl: ModalController, private plt: Platform, private location: Location) {
  }

  ngOnInit() {
    this.database.HabilitarCaptura(this.idlocal, 1, this.obraid, this.idcomite, this.userid);
    this.habilitado = 1;
    this.checkValue = true;
    this.activatedRoute.queryParams.subscribe(queryParams => {
    this.fechaEnRangoParam = queryParams.fechaEnRangoParam;
  });
    if (this.metodoContraloria) {
      this.tipoContraloria = this.metodoContraloria;
    } else {
      this.tipoContraloria = this.tipo;
    }
    this.validarComite(0, this.obraid, this.idcomite, this.userid, this.tipo, this.metodoContraloria);
    this.database.GetComiteHabilitado(this.idcomite, this.obraid, this.userid).then((data) => {
      if (data === 1) {
        this.habilitado = 1;
        this.checkValue = true;
      } else {
        this.habilitado = 0;
        this.checkValue = false;
      }
      // this.validarComite(0, this.obraid, this.idcomite, this.userid, this.tipo, this.metodoContraloria);
    });
    if (this.fechaEnRangoParam === 1 || this.fechaEnRangoParam === 0) {
      this.fechaEnRango = this.fechaEnRangoParam;
    } else {
      const date = new Date(this.fechaHoy);
      this.fechaHoy = this.datePipe.transform(date, 'MM/dd/yyyy');
      if (this.fechaAgenda === this.fechaHoy) {
        this.fechaEnRango = 1;
      } else {
        this.fechaEnRango = 0;
      }
    }
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  async vaciarInformacion() {
    const alertBorrar = await this.alert.create({
      header: 'SICSEQ',
      message: 'Al borrar se perdera la información capturada, Borrar?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.habilitado = 1;
            this.checkValue = 'true';
          }
        },
        {
          text: 'Si',
          handler: () => {
            this.listaAsistenciaStatus = 'incompleto';
            this.integracionStatus = 'incompleto';
            this.integracionEvidenciaStatus = 'incompleto';
            this.capacitacionEvidenciaStatus = 'incompleto';
            this.capacitacionStatus = 'incompleto';
            this.evidenciaComiteStatus = 'incompleto';
            this.database.HabilitarCaptura(this.idlocal, 0, this.obraid, this.idcomite, this.userid);
            if (this.moduloOrigen === 'comiteAgenda') {
              this.database.GetComitesEnviados(this.userid, this.rol);
              this.database.GetComitesHoy(this.userid);
              this.database.GetComitesProximos(this.userid);
            }
            if (this.moduloOrigen === 'comiteObra') {
              this.database.GetComites(this.obraid, this.idlocal, this.userid, this.rol);
            }
            this.habilitado = 0;
            this.checkValue = 'false';
            this.modalCtrl.dismiss({
              dismissed: true,
            });
          }
        }
      ]
    });
    await alertBorrar.present();
  }

  async habilitarCaptura(value: any) {
    if (value.detail.checked === true) {
      this.database.HabilitarCaptura(this.idlocal, 1, this.obraid, this.idcomite, this.userid);
      this.habilitado = 1;
      this.checkValue = true;
    }
    if (value.detail.checked === false) {
      const alertBorrar = await this.alert.create({
        header: 'SICSEQ',
        message: 'Al deshabilitar se borrara la información capturada, ¿Deshabilitar captura?',
        backdropDismiss: false,
        buttons: [
          {
            text: 'No',
            handler: () => {
              this.habilitado = 1;
              this.checkValue = 'true';
            }
          },
          {
            text: 'Si',
            handler: () => {
              this.listaAsistenciaStatus = 'incompleto';
              this.integracionStatus = 'incompleto';
              this.integracionEvidenciaStatus = 'incompleto';
              this.capacitacionEvidenciaStatus = 'incompleto';
              this.capacitacionStatus = 'incompleto';
              this.evidenciaComiteStatus = 'incompleto';
              this.database.HabilitarCaptura(this.idlocal, 0, this.obraid, this.idcomite, this.userid);
              this.database.GetComites(this.obraid, this.idlocal, this.userid, this.rol);
              this.habilitado = 0;
              this.checkValue = 'false';
            }
          }
        ]
      });
      await alertBorrar.present();
    }
  }

  dismiss() {
    if (this.moduloOrigen === 'comiteAgenda') {
      this.database.GetComitesEnviados(this.userid, this.rol);
      this.database.GetComitesHoy(this.userid);
      this.database.GetComitesProximos(this.userid);
    }
    if (this.moduloOrigen === 'comiteObra') {
      this.database.GetComites(this.obraid, this.idlocal, this.userid, this.rol);
    }
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  captura(opcion) {
    if (this.habilitado === 1 && this.fechaEnRango === 1) {
    if (opcion === 'Integración de Comités') {
      this.navCtrl.navigateRoot('captura-integracion', {
        queryParams: {
           comite : this.comite,
           obra: this.obra,
           // tslint:disable-next-line:object-literal-shorthand
            tipo: this.tipo,
            obraid: this.obraid,
            idcomite: this.idcomite,
            userid: this.userid,
            idlocal: this.idlocal,
            descripcion: this.descripcion,
            tipofondo: this.tipofondo,
            normativaNombre: this.normativaNombre,
            metodoContraloria: this.metodoContraloria,
            fechaAgenda: this.fechaAgenda,
            fechaHoy: this.fechaHoy,
            fechaEnRango: this.fechaEnRango,
            moduloOrigen: this.moduloOrigen
        }
      });
      this.modalCtrl.dismiss({
        dismissed: true
      });
    }
    if (opcion === 'Capacitación de Comités') {
      this.navCtrl.navigateRoot('captura-capacitacion', {
        queryParams: {
           comite : this.comite,
           obra: this.obra,
           // tslint:disable-next-line:object-literal-shorthand
            tipo: this.tipo,
            obraid: this.obraid,
            idcomite: this.idcomite,
            userid: this.userid,
            idlocal: this.idlocal,
            descripcion: this.descripcion,
            tipofondo: this.tipofondo,
            normativaNombre: this.normativaNombre,
            metodoContraloria: this.metodoContraloria,
            fechaAgenda: this.fechaAgenda,
            fechaHoy: this.fechaHoy,
            fechaEnRango: this.fechaEnRango,
            moduloOrigen: this.moduloOrigen
        }
      });
      this.modalCtrl.dismiss({
        dismissed: true
      });
    }
  }
  }

  evidencia(modulo, accion, module, action) {
    if (this.habilitado === 1 && this.fechaEnRango === 1) {
    this.navCtrl.navigateRoot('evidencias', {
      queryParams: {
         comite : this.comite,
         obra: this.obra,
         // tslint:disable-next-line:object-literal-shorthand
         modulo: modulo,
         // tslint:disable-next-line:object-literal-shorthand
         accion: accion,
         // tslint:disable-next-line:object-literal-shorthand
         tipo: this.tipo,
         obraid: this.obraid,
         idcomite: this.idcomite,
         userid: this.userid,
         idlocal: this.idlocal,
         descripcion: this.descripcion,
         tipofondo: this.tipofondo,
         // tslint:disable-next-line:object-literal-shorthand
         module: module,
         // tslint:disable-next-line:object-literal-shorthand
         action: action,
         normativaNombre: this.normativaNombre,
         metodoContraloria: this.metodoContraloria,
         fechaEnRango: this.fechaEnRango,
         moduloOrigen: this.moduloOrigen,
         fechaAgenda: this.fechaAgenda
      }
    });
    this.fotoService.ObtenerFotos(module, action, this.obraid, this.idcomite, this.userid);
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }
  }

  validarComite(idLocal: any, idObra: any, idComite: any, idUsuario, tipo: any, metodoContraloria: any) {
    this.database.GetAgendaConfirmada(this.obraid, idComite, this.userid).then((data) => {
      if (this.metodoIntegracion !== null) {
        if (this.metodoIntegracion === 'fisico') {
          this.database.validaEvidencia(idLocal, idObra, idComite, this.userid, 'foto', 'integracion').then((data2: number) => {
            if (data2 > 0) {
              this.integracionStatus = 'incompleto';
            } else {
              this.integracionStatus = 'completo';
            }
            this.database.validaEvidencia(idLocal, idObra, idComite, this.userid, 'evidencia', 'integracion').then((data3: number) => {
              if (data3 > 0) {
                this.integracionEvidenciaStatus = 'incompleto';
              } else {
                this.integracionEvidenciaStatus = 'completo';
              }
            });
          });
        } else {
          this.database.validaEvidencia(idLocal, idObra, idComite, this.userid, 'evidencia', 'integracion').then((data6: number) => {
            if (data6 > 0) {
              this.integracionEvidenciaStatus = 'incompleto';
            } else {
              this.integracionEvidenciaStatus = 'completo';
            }
            this.database.validarIntegracionDigital(idLocal, idObra, idComite, this.userid).then((data7: number) => {
              if (data7 > 0) {
                this.integracionStatus = 'incompleto';
              } else {
                this.integracionStatus = 'completo';
              }
            });
          });
        }
      }
      if (this.metodoCapacitacion !== null) {
        if (this.metodoCapacitacion === 'fisico') {
          this.database.validaEvidencia(idLocal, idObra, idComite, this.userid, 'foto', 'capacitacion').then((data4: number) => {
            if (data4 > 0) {
              this.capacitacionStatus = 'incompleto';
            } else {
              this.capacitacionStatus = 'completo';
            }
            this.database.validaEvidencia(idLocal, idObra, idComite, this.userid, 'evidencia', 'capacitacion').then((data5: number) => {
              if (data5 > 0) {
                this.capacitacionEvidenciaStatus = 'incompleto';
              } else {
                this.capacitacionEvidenciaStatus = 'completo';
              }
            });
          });
        } else {
          this.database.validaEvidencia(idLocal, idObra, idComite, this.userid, 'evidencia', 'capacitacion').then((data8: number) => {
            if (data8 > 0) {
              this.capacitacionEvidenciaStatus = 'incompleto';
            } else {
              this.capacitacionEvidenciaStatus = 'completo';
            }
            this.database.validarCapacitacionDigital(idLocal, idObra, idComite, this.userid).then((data9: number) => {
              if (data9 > 0) {
                this.capacitacionStatus = 'incompleto';
              } else {
                this.capacitacionStatus = 'completo';
              }
            });
          });
        }
      }
      this.database.validarListaAsistencia(idLocal, idObra, idComite, this.userid).then((data10: number) => {
        if (data10 > 0) {
          this.listaAsistenciaStatus = 'incompleto';
        } else {
          this.listaAsistenciaStatus = 'completo';
        }
      });
      this.database.validarEvidenciaComite(idLocal, idObra, idComite, this.userid).then((data11: number) => {
        if (data11 > 0) {
          this.evidenciaComiteStatus = 'incompleto';
        } else {
          this.evidenciaComiteStatus = 'completo';
        }
      });
    });
  }

  generaActaCap() {
    this.navCtrl.navigateRoot('genera-capacitacion', {
       queryParams: {
       }
    });
   }

   generaActaInt() {
     this.navCtrl.navigateRoot('genera-integracion', {
        queryParams: {
        }
     });
   }
}
