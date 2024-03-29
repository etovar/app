import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { DocsComitePage } from '../modal/docs-comite/docs-comite.page';
import { BdService } from '../services/bd/bd.service';
import { SubirService } from '../services/subir-informacion/subir.service';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { LoadingController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { OfflineService } from '../services/offline/offline.service';
import { FileOpener } from '@ionic-native/file-opener/ngx';
@Component({
  selector: 'app-comites',
  templateUrl: './comites.page.html',
  styleUrls: ['./comites.page.scss'],
})
export class ComitesPage implements OnInit {
  columns: any;
  rows: any;
  obra: any;
  descripcion: any;
  nombreObra: any;
  idcomite: any;
  comite = null;
  obraLabel: any;
  tipo: any;
  idobra: any;
  idlocal: any;
  idusuario: any;
  tipofondo: any;
  rol: any;
  normativaNombre: any;
  metodoContraloria: any;
  agendaConfirmada: any;
  integracionValidar: number;
  capacitacionValidar: number;
  listaAsisValidar: number;
  evidenciaComValidar: number;
  comiteStatus: any;
  agendaFecha: any;
  fechaAgendaValida: any;
  fechaActual: any;
  fechaHoyFormat: any;
  fechaEnRango: any;
  imageurl = '/assets/img/estado.png';
  public fechaHoy = Date.now();
  public results: any;
  // tslint:disable-next-line:max-line-length
  constructor(private offline: OfflineService, private datePipe: DatePipe, private changeDetector: ChangeDetectorRef, private subirInfo: SubirService, private loadingController: LoadingController, public appc: AppComponent, public navCtrl: NavController, public alert: AlertController, public database: BdService, public modalController: ModalController, private menu: MenuController, public activatedRoute: ActivatedRoute, private fileOpener: FileOpener) {
  }

  ngOnInit() {
    this.menu.enable(true, 'custom');
    this.menu.close();
    this.nombreObra = 'Rehabilitación de Escuela TB Secundaria Juana de Asbaje, San José Tepuzas';
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.obraLabel = queryParams.nombre;
      this.obra = queryParams.nombre;
      this.descripcion = queryParams.descripcion;
      this.idobra = queryParams.idobra,
      this.idlocal = queryParams.idlocal,
      this.idusuario = queryParams.idusuario;
      this.comite = queryParams.comite;
      this.tipo = queryParams.tipo;
      this.idcomite = queryParams.idcomite;
      this.tipofondo = queryParams.tipofondo;
      this.normativaNombre = queryParams.normativaNombre;
      this.metodoContraloria = queryParams.metodoContraloria;
      this.fechaEnRango = queryParams.fechaEnRangoParam;
    });
    this.rol = this.appc.rol;
    this.database.GetComites(this.idobra, this.idlocal, this.idusuario, this.rol);
    if (this.comite != null) {
      // tslint:disable-next-line:max-line-length
      this.comiteModal(this.obraLabel, this.comite, this.tipo, this.idcomite, this.tipofondo, this.normativaNombre, this.metodoContraloria, this.agendaFecha, this.fechaActual);
    }
    const date = new Date(this.fechaHoy);
    this.fechaHoyFormat = this.datePipe.transform(date, 'MM/dd/yyyy');
  }

  async borrarComite(idLocal: any, obraid: any, comiteid: any, userid: any) {
    let mensaje: any;
    mensaje = '¿Desea eliminar este comite?';
    if (this.database.arrayComitesGrl.length === 1) {
      mensaje = 'Si elimina el comite se eliminara la obra automaticamente<br> ¿Desea eliminar el comite?';
    }
    const alertBorrar = await this.alert.create({
      header: 'SICSEQ',
      message: mensaje,
      backdropDismiss: false,
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Si',
          handler: () => {
          this.database.BorrarComite(idLocal, obraid, comiteid, userid).then(async (data) => {
            const alert = await this.alert.create({
              header: 'SICSEQ',
              message: 'Comite eliminado',
              backdropDismiss: false,
              buttons: [
                {
                  text: 'Cerrar',
                  role: 'cancel',
                  handler: () => {
                  if (this.database.arrayComitesGrl.length === 1) {
                    // borrar obra
                    this.database.BorrarObra(this.idobra, this.idlocal, this.idusuario).then(async (data2) => {
                      console.log('Obra eliminada');
                    }, async (error) => {
                      const alert3 = await this.alert.create({
                        header: 'SICSEQ',
                        message: 'Error al eliminar la obra',
                        backdropDismiss: false,
                        buttons: ['Cerrar']
                      });
                      await alert3.present();
                    });
                    this.navCtrl.navigateRoot('home');
                  } else {
                    this.database.GetComites(this.idobra, this.idlocal, this.idusuario, this.rol);
                  }
                  }
                }
              ]
            });
            await alert.present();
          }, async (error) => {
            const alert = await this.alert.create({
              header: 'SICSEQ',
              message: 'Error al eliminar el comite',
              backdropDismiss: false,
              buttons: ['Cerrar']
            });
            await alert.present();
          });
          }
        }
      ]
    });
    await alertBorrar.present();
  }

  async subirInformacion(status: any, comiteId: any, tipoActa: any) {
  if (this.offline.getCurrentNetworkStatus() === 0) {
    if (status === 'incompleto') {
      const alertIncompleto = await this.alert.create({
        header: 'SICSEQ',
        backdropDismiss: false,
        message: 'Información incompleta, revisar la información del comite',
        buttons: [
          {
            text: 'Cerrar',
            role: 'cancel'
          }
        ]
      });
      await alertIncompleto.present();
    } else {
      if (status === 'completo') {
        const loading = await this.loadingController.create({
          message: 'Validando.....'
        });
        await loading.present();
        this.database.getComiteInfo(this.idobra, comiteId, this.idusuario).then((data) => {
          // tslint:disable-next-line:max-line-length
          this.results = this.subirInfo.enviarInformacionComite(0, this.idobra, comiteId, this.idusuario, this.appc.usuario, this.appc.userp, this.appc.rol);
          this.results.subscribe(
              async (results: any) => {
                if (results.status === 0) {
                  loading.dismiss();
                  const alert = await this.alert.create({
                    header: 'SICSEQ',
                    message: 'Credenciales de usuario incorrectas',
                    backdropDismiss: false,
                    buttons: [
                      {
                          text: 'Cerrar',
                          handler: () => {
                              alert.dismiss(true);
                              this.appc.logout();
                              return false;
                          }
                      }
                  ]
                  });
                  await alert.present();
                } else {
                  if (results.token === 1) {
                    this.database.setComiteGuardado(results.idObra, results.idComite, results.idUsuario).then(async (dataUpdateComite) => {
                    this.subirInfo.descargarACTA(tipoActa, results.idObra, results.idComite, results.idUsuario);
                    loading.dismiss();
                    const alert = await this.alert.create({
                      header: 'SICSEQ',
                      message: 'Información guardada',
                      backdropDismiss: false,
                      buttons: [
                        {
                            text: 'Cerrar',
                            handler: () => {
                                alert.dismiss(true);
                                this.appc.obras();
                                return false;
                            }
                        }
                    ]
                    });
                    await alert.present();
                    });
                  } else {
                    if (results.token === 2) {
                      // this.database.setComiteGuardado(results.idObra, results.idComite, results.idUsuario);
                      loading.dismiss();
                      const alert = await this.alert.create({
                        header: 'SICSEQ',
                        message: 'Error al subir la información',
                        backdropDismiss: false,
                        buttons: [
                          {
                              text: 'Cerrar',
                              handler: () => {
                                  alert.dismiss(true);
                                  return false;
                              }
                          }
                      ]
                      });
                      await alert.present();
                    } else {
                    loading.dismiss();
                    const alertToken = await this.alert.create({
                      header: 'SICSEQ',
                      message: 'Alguna información del comite cambio',
                      backdropDismiss: false,
                      buttons: [
                        {
                            text: 'Cerrar',
                            handler: () => {
                                alertToken.dismiss(true);
                                return false;
                            }
                        }
                    ]
                    });
                    await alertToken.present();
                  }
                }
                }
                },
                async err => {
                  loading.dismiss();
                  const alertToken = await this.alert.create({
                    header: 'SICSEQ',
                    message: 'Error al subir la información',
                    backdropDismiss: false,
                    buttons: [
                      {
                          text: 'Cerrar',
                          handler: () => {
                              alertToken.dismiss(true);
                              return false;
                          }
                      }
                  ]
                  });
                  await alertToken.present();
                });
        });
      }
    }
  } else {
    const alertToken = await this.alert.create({
      header: 'SICSEQ',
      message: 'No se puede actualizar la información por problemas de red',
      backdropDismiss: false,
      buttons: [
        {
            text: 'Cerrar',
            handler: () => {
                alertToken.dismiss(true);
                return false;
            }
        }
    ]
    });
    await alertToken.present();
  }
  }

  validarComite(idLocal: any, idObra: any, idComite: any, idUsuario, tipo: any, metodoContraloria: any) {
    this.evidenciaComValidar = 0;
    this.listaAsisValidar = 0;
    this.integracionValidar = 0;
    this.capacitacionValidar = 0;
    this.database.GetAgendaConfirmada(this.idobra, idComite, this.idusuario).then(async (data) => {
      this.agendaConfirmada = data;
      let metodoIntegracion: any;
      let metodoCapacitacion: any;
      metodoIntegracion = null;
      metodoCapacitacion = null;
      if (this.tipofondo === 'ESTATAL') {
      // 1 -> ejecutora, 2 -> cs
      if (this.rol === 1 || this.rol === '1') {
        metodoIntegracion = tipo;
        if (this.agendaConfirmada === 0) {
          metodoCapacitacion = tipo;
        }
      } else {
        if (this.agendaConfirmada === 1) {
          metodoCapacitacion = metodoContraloria;
        } else {
          metodoCapacitacion = tipo;
        }
      }
    } else {
      // 1 -> ejecutora, 2 -> cs
      if (this.rol === 1 || this.rol === '1') {
        metodoIntegracion = 'fisico';
        if (this.agendaConfirmada === 0) {
          metodoCapacitacion = 'fisico';
        }
      } else {
        if (this.agendaConfirmada === 1) {
          metodoCapacitacion = metodoContraloria;
        } else {
          metodoCapacitacion = 'fisico';
        }
      }
    }

      if (metodoIntegracion !== null) {
        if (metodoIntegracion === 'fisico') {
          this.integracionValidar = 0;
          let validacion = 0;
          this.database.validaEvidencia(idLocal, idObra, idComite, this.idusuario, 'foto', 'integracion').then((data2: number) => {
            validacion = data2;
            this.database.validaEvidencia(idLocal, idObra, idComite, this.idusuario, 'evidencia', 'integracion').then((data3: number) => {
              validacion = validacion + data3;
              this.integracionValidar = validacion;
            });
          });
        } else {
          this.integracionValidar = 0;
          let validacion = 0;
          this.database.validaEvidencia(idLocal, idObra, idComite, this.idusuario, 'evidencia', 'integracion').then((data6: number) => {
            validacion = data6;
            this.database.validarIntegracionDigital(idLocal, idObra, idComite, this.idusuario).then((data7: number) => {
              validacion = validacion + data7;
              this.integracionValidar = validacion;
            });
          });
        }
      }
      if (metodoCapacitacion !== null) {
        if (metodoCapacitacion === 'fisico') {
          this.capacitacionValidar = 0;
          let validacion = 0;
          this.database.validaEvidencia(idLocal, idObra, idComite, this.idusuario, 'foto', 'capacitacion').then((data4: number) => {
            validacion = data4;
            this.database.validaEvidencia(idLocal, idObra, idComite, this.idusuario, 'evidencia', 'capacitacion').then((data5: number) => {
              validacion = validacion + data5;
              this.capacitacionValidar = validacion;
            });
          });
        } else {
          this.capacitacionValidar = 0;
          let validacion = 0;
          this.database.validaEvidencia(idLocal, idObra, idComite, this.idusuario, 'evidencia', 'capacitacion').then((data8: number) => {
            validacion = data8;
            this.database.validarCapacitacionDigital(idLocal, idObra, idComite, this.idusuario).then((data9: number) => {
              validacion = validacion + data9;
              this.capacitacionValidar = validacion;
            });
          });
        }
      }
      let tipoActa: any;
      if (metodoIntegracion !== null) {
        tipoActa = 'integracion';
      }
      if (metodoCapacitacion !== null) {
        tipoActa = 'capacitacion';
      }
      if (metodoIntegracion !== null && metodoCapacitacion !== null) {
        tipoActa = 'ambas';
      }
      this.database.validarListaAsistencia(idLocal, idObra, idComite, this.idusuario).then((data10: number) => {
        this.listaAsisValidar = data10;
      });
      /* this.database.validarEvidenciaComite(idLocal, idObra, idComite, this.idusuario).then((data11: number) => {
        this.evidenciaComValidar = data11;
      }); */
      const loading = await this.loadingController.create({
        message: 'Validando.....'
      });
      setTimeout(async () => {
        if ((this.evidenciaComValidar + this.listaAsisValidar + this.integracionValidar + this.capacitacionValidar) > 0) {
          await loading.present();
          setTimeout(() => {
            loading.dismiss();
            this.subirInformacion('incompleto', idComite, tipoActa);
          }, 2000);
        } else {
          this.subirInformacion('completo', idComite, tipoActa);
        }
      }, 1500);
    });
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  // tslint:disable-next-line:max-line-length
  comiteModal(obra: string, comite: string, tipo: string, idcomite: any, fondo: any, normativaNombre: any, metodoContraloria: any, agendaFecha: any, fechaHoy: any) {
    this.database.GetAgendaConfirmada(this.idobra, idcomite, this.idusuario).then(async (data) => {
      this.agendaConfirmada = data;
      let metodoIntegracion: any;
      let metodoCapacitacion: any;
      metodoIntegracion = null;
      metodoCapacitacion = null;
      if (this.tipofondo === 'ESTATAL') {
      // 1 -> ejecutora, 2 -> cs
      if (this.rol === 1 || this.rol === '1') {
        metodoIntegracion = tipo;
        if (this.agendaConfirmada === 0) {
          metodoCapacitacion = tipo;
        }
      } else {
        if (this.agendaConfirmada === 1) {
          metodoCapacitacion = metodoContraloria;
        } else {
          metodoCapacitacion = tipo;
        }
      }
    } else {
      // 1 -> ejecutora, 2 -> cs
      if (this.rol === 1 || this.rol === '1') {
        metodoIntegracion = 'fisico';
        if (this.agendaConfirmada === 0) {
          metodoCapacitacion = 'fisico';
        }
      } else {
        if (this.agendaConfirmada === 1) {
          metodoCapacitacion = metodoContraloria;
        } else {
          metodoCapacitacion = 'fisico';
        }
      }
    }
      if (agendaFecha === this.fechaHoyFormat || this.fechaEnRango === 1) {
        const modal = await this.modalController.create({
        component: DocsComitePage,
        componentProps: {
          id: 1,
          // tslint:disable-next-line:object-literal-shorthand
          obra: this.obra,
          // tslint:disable-next-line:object-literal-shorthand
          obraid: this.idobra,
          // tslint:disable-next-line:object-literal-shorthand
          comite: comite,
          // tslint:disable-next-line:object-literal-shorthand
          userid: this.idusuario,
          // tslint:disable-next-line:object-literal-shorthand
          tipo: tipo,
          // tslint:disable-next-line:object-literal-shorthand
          idcomite: idcomite,
          descripcion: this.descripcion,
          idlocal: this.idlocal,
          tipofondo: this.tipofondo,
          rol: this.rol,
          // tslint:disable-next-line:object-literal-shorthand
          normativaNombre: normativaNombre,
          // tslint:disable-next-line:object-literal-shorthand
          metodoContraloria: metodoContraloria,
          // tslint:disable-next-line:object-literal-shorthand
          metodoIntegracion: metodoIntegracion,
          // tslint:disable-next-line:object-literal-shorthand
          metodoCapacitacion: metodoCapacitacion,
          fechaHoy,
          fechaAgenda: agendaFecha,
          moduloOrigen: 'comiteObra'
        }
      });
        return await modal.present();
      } else {
        const alertToken = await this.alert.create({
          header: 'SICSEQ',
          message: 'Comite no esta en fecha',
          backdropDismiss: false,
          buttons: [
            {
                text: 'Cerrar',
                handler: () => {
                    alertToken.dismiss(true);
                    return false;
                }
            }
        ]
        });
        await alertToken.present();
      }
    });
  }

  generaActaCap(idObra: any, idComite: any) {
    this.database.ValidateActaOriginalGenerada(idComite, idObra, this.idusuario).then(async (data) => {
      if (data[0].pathCapacitacion !== null) {
        if (data[0].pathCapacitacion === 'error') {
          const alertToken = await this.alert.create({
            header: 'SICSEQ',
            message: 'El acta no se pudo guardar correctamente cuando se subio la información, revise la ubicación donde se guardo',
            backdropDismiss: false,
            buttons: [
              {
                  text: 'Cerrar',
                  handler: () => {
                      alertToken.dismiss(true);
                      return false;
                  }
              }
          ]
          });
          await alertToken.present();
        } else {
          this.fileOpener.open(data[0].pathCapacitacion, 'application/pdf')
          .then(() => console.log('File is opened'))
          .catch(e => console.log('Error opening file', e));
        }
      } else {
        this.navCtrl.navigateRoot('genera-capacitacion', {
          queryParams: {
            // tslint:disable-next-line:object-literal-shorthand
            idObra: idObra,
            // tslint:disable-next-line:object-literal-shorthand
            idComite: idComite
          }
       });
      }
    });
  }

  generaActaInt(idObra: any, idComite: any) {
    this.database.ValidateActaOriginalGenerada(idComite, idObra, this.idusuario).then(async (data) => {
      if (data[0].pathIntegracion !== null) {
        if (data[0].pathIntegracion === 'error') {
          const alertToken = await this.alert.create({
            header: 'SICSEQ',
            message: 'El acta no se pudo guardar correctamente cuando se subio la información, revise la ubicación donde se guardo',
            backdropDismiss: false,
            buttons: [
              {
                  text: 'Cerrar',
                  handler: () => {
                      alertToken.dismiss(true);
                      return false;
                  }
              }
          ]
          });
          await alertToken.present();
        } else {
          this.fileOpener.open(data[0].pathIntegracion, 'application/pdf')
          .then(() => console.log('File is opened'))
          .catch(e => console.log('Error opening file', e));
        }
      } else {
        this.navCtrl.navigateRoot('genera-integracion', {
           queryParams: {
            // tslint:disable-next-line:object-literal-shorthand
            idObra: idObra,
            // tslint:disable-next-line:object-literal-shorthand
            idComite: idComite
           }
        });
      }
    });
   }

   test(uno: any, dos: any, tres: any, cuatro: any) {
    this.subirInfo.descargarACTA('integracion', dos, tres, cuatro);
   }
}
