import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModalController, Platform, MenuController, NavController } from '@ionic/angular';
import { FichaModalPage } from '../modal/ficha-modal/ficha-modal.page';
import { Location } from '@angular/common';
import { DescargarService } from '../services/descargar-obra/descargar.service';
import { AlertController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { BdService } from '../services/bd/bd.service';
import { OfflineService } from '../services/offline/offline.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  myDate: string = new Date().toISOString();
  public columns: any;
  public rows: any;
  public nombre: any;
  public inicio: any;
  public fin: any;
  public results: any;
  public idUsuario: any;
  imageurl = '/assets/img/estado.png';
  filteredData = [];
  downloadForm: FormGroup;

  async ngOnInit() {
   this.downloadForm = this.formBuilder.group({
     inicio: ['', [Validators.required]],
     fin: ['', [Validators.required]]
 }, {});
   this.menu.enable(true, 'base');
   this.menu.close();
   this.storage.get('login-usuario-id').then(res => {
     if (res) {
      this.idUsuario = res;
      if (this.AppComp.descargarFlag === 2) {
       this.descargar(null);
      }
      this.database.GetObras(res);
     }
   });
   // this.database.CargarInfoGuardada();
 }

  // tslint:disable-next-line:max-line-length
  constructor(private offline: OfflineService, private database: BdService, public AppComp: AppComponent, public alert: AlertController, private descargarObra: DescargarService, private menu: MenuController, public modalController: ModalController, private formBuilder: FormBuilder, public navCtrl: NavController, private storage: Storage, private plt: Platform, private location: Location) {
   /*this.plt.backButton.subscribe(() => {
      this.location.back();
    });*/
  }

  async fichaModal(id: any, nombre: string, idobra: number) {
   const modal = await this.modalController.create({
     component: FichaModalPage,
     componentProps: {
       idObraLocal: id,
       id: idobra,
       name: nombre,
       usuario: this.idUsuario
     }
   });
   return await modal.present();
 }

 comites(nombre: string, descripcion: string, idobra: number, idLocal: number, tipofondo: any) {
   this.nombre = nombre;
   this.navCtrl.navigateRoot('comites', {
      queryParams: {
         nombre : this.nombre,
         // tslint:disable-next-line:object-literal-shorthand
         descripcion : descripcion,
         // tslint:disable-next-line:object-literal-shorthand
         idobra : idobra,
         idlocal : idLocal,
         idusuario: this.idUsuario,
         // tslint:disable-next-line:object-literal-shorthand
         tipofondo: tipofondo
      }
   });
 }

 async borrarObra(idLocal, idObra) {
   const alertBorrar = await this.alert.create({
     header: 'SICSEQ',
     message: '¿Desea borrar esta obra? <br> Todos los comites dentro de esta obra se eliminaran.',
     backdropDismiss: false,
     buttons: [
       {
         text: 'No',
         role: 'cancel'
       },
       {
         text: 'Si',
         handler: () => {
          this.database.BorrarObraYComites(idLocal, idObra, this.idUsuario).then(async (data) => {
            const alert = await this.alert.create({
              header: 'SICSEQ',
              message: 'Obra eliminada',
              backdropDismiss: false,
              buttons: ['Cerrar']
            });
            await alert.present();
            this.database.GetObras(this.idUsuario);
            }, async (error) => {
              const alert = await this.alert.create({
                header: 'SICSEQ',
                backdropDismiss: false,
                message: 'Error al eliminar la obra',
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

 async descargar(value: any) {
  this.database.arrayComitesHabilitadosApp = [];
  this.database.arrayObrasApp = [];
  this.database.arrayComitesApp = [];
  this.database.GetAppInfo(this.idUsuario);
  let msgDescarga = '';
  if (this.offline.getCurrentNetworkStatus() === 0) {
    setTimeout(() => {
        // tslint:disable-next-line:max-line-length
    this.results = this.descargarObra.descargarObras(this.AppComp.usuario, this.AppComp.rol, this.AppComp.iduser, this.AppComp.userp, this.idUsuario);
    this.results.subscribe(
            async (results: any) => {
              results = JSON.parse(results);
              if (results.status === 0) {
                const alert = await this.alert.create({
                  header: 'SICSEQ',
                  message: 'No se encontro información para descargar',
                  backdropDismiss: false,
                  buttons: ['Cerrar']
                });
                await alert.present();
              } else {
                if (results.status === 1) {
                if (results.obrasNuevos !== null) {
                  if (results.obrasNuevos.length > 0) {
                    msgDescarga = msgDescarga + results.obrasNuevos.length + ' obras nuevas<br>';
                  }

                  // tslint:disable-next-line:prefer-const
                  for (let obra of results.obrasNuevos) {
                    this.database.FindObra(this.idUsuario, obra.id_obra).then(async (data) => {
                      if (data === 'nuevo') {
                        // tslint:disable-next-line:max-line-length
                        this.database.InsertarObra(null, obra.id_obra, obra.num_obra, obra.nombre_obra, obra.mmunicipio, obra.localidad, obra.status_obra, obra.monto_aprobado, obra.fondo, obra.ejecutora, obra.normativa, obra.inicio_obra, obra.termino_obra, this.AppComp.iduser, obra.lat, obra.lon, obra.tipofondo, obra.token, obra.programa);
                      }
                    }, async (error) => {
                      console.log(error);
                    });
                  }
                }

                if (results.obrasActualizarTokenIgual !== null) {
                  if (results.obrasActualizarTokenIgual.length > 0) {
                    msgDescarga = msgDescarga + results.obrasActualizarTokenIgual.length + ' obras actualizadas<br>';
                  }
                  // tslint:disable-next-line:prefer-const
                  for (let obra of results.obrasActualizarTokenIgual) {
                    this.database.ActualizarObraActualizacion(obra.id_obra, this.idUsuario, obra);
                  }
                }

                if (results.obrasActualizarTokenCambio !== null) {
                  if (results.obrasActualizarTokenCambio.length > 0) {
                    // tslint:disable-next-line:max-line-length
                    msgDescarga = msgDescarga + results.obrasActualizarTokenCambio.length + ' obras actualizadas con cambios importantes<br>';
                  }
                  // tslint:disable-next-line:prefer-const
                  for (let obra of results.obrasActualizarTokenCambio) {
                    this.database.ActualizarObraActualizacion(obra.id_obra, this.idUsuario, obra);
                  }
                }

                if (results.obrasBorrados !== null) {
                  let obrasBorradasTotal = 0;
                  // tslint:disable-next-line:prefer-const
                  for (let obra of results.obrasBorrados) {
                    this.database.ValidarBorradoIdObra(obra.idObra, this.idUsuario).then((data) => {
                      if (data === 1) {
                        this.database.BorrarObraActualizacion(obra.idObra, this.idUsuario);
                        obrasBorradasTotal = obrasBorradasTotal + 1;
                      } else {

                      }
                    });
                  }
                  if (results.obrasBorrados.length > 0) {
                    msgDescarga = msgDescarga + obrasBorradasTotal + ' obras eliminadas<br>';
                  }
                }

                if (results.comitesHabilitadosCambiaron !== null) {
                    // tslint:disable-next-line:max-line-length
                    msgDescarga = msgDescarga + 'Los siguientes comites estan habilitados y sufrieron cambios significantes: ' + results.comitesHabilitadosCambiaron + ' <br>';
                }

                if (results.comitesNuevos !== null) {
                  if (results.comitesNuevos.length > 0) {
                    msgDescarga = msgDescarga + results.comitesNuevos.length + ' comites nuevos<br>';
                  }
                  // tslint:disable-next-line:prefer-const
                  for (let comite of results.comitesNuevos) {
                    this.database.FindComite(this.idUsuario, comite.obra_id, comite.id_comite).then(async (data) => {
                      if (data === 'nuevo') {
                        // tslint:disable-next-line:max-line-length
                        this.database.InsertarComite(null, comite.contraloria_usuario_id, comite.agenda_confirmada, comite.origen, comite.id_comite, comite.num_comite, comite.metodo, comite.obra_id, comite.status, comite.agenda_fecha, comite.agenda_hora_inicio, comite.agenda_hora_fin, comite.usuario_id, comite.id_obra, comite.fondo, comite.norma_cs_aplica, this.AppComp.iduser, comite.normativa, comite.metodo_contraloria, comite.contraloria_asistente, comite.token, comite.cargo_ejecutora, comite.cargo_normativa, comite.cargo_dependencia_normativa);
                      }
                    }, async (error) => {
                        console.log(error);
                      });
                    }
                }

                if (results.comitesActualizarTokenIgual !== null) {
                  if (results.comitesActualizarTokenIgual.length > 0) {
                    msgDescarga = msgDescarga + results.comitesActualizarTokenIgual.length + ' comites actualizados<br>';
                  }
                  // tslint:disable-next-line:prefer-const
                  for (let comite of results.comitesActualizarTokenIgual) {
                    this.database.ActualizarComiteActualizacion(comite.obra_id, comite.id_comite, this.idUsuario, comite);
                  }
                }

                if (results.comitesActualizarTokenCambio !== null) {
                  if (results.comitesActualizarTokenCambio.length > 0) {
                    // tslint:disable-next-line:max-line-length
                    msgDescarga = msgDescarga + results.comitesActualizarTokenCambio.length + ' comites actualizados con cambios importantes<br>';
                  }
                  // tslint:disable-next-line:prefer-const
                  for (let comite of results.comitesActualizarTokenCambio) {
                    this.database.ActualizarComiteActualizacion(comite.obra_id, comite.id_comite, this.idUsuario, comite);
                  }
                }

                if (results.comitesBorrados !== null) {
                  if (results.comitesBorrados.length > 0) {
                    msgDescarga = msgDescarga + results.comitesBorrados.length + ' comites actualizados borrados<br>';
                  }
                  // tslint:disable-next-line:prefer-const
                  for (let comite of results.comitesBorrados) {
                    this.database.BorrarComiteActualizacion(comite.IdObra, comite.idComite, this.idUsuario);
                  }
                }

                const alert = await this.alert.create({
                  header: 'SICSEQ',
                  message: 'Descarga exitosa<br>' + msgDescarga,
                  backdropDismiss: false,
                  buttons: ['Cerrar']
                });
                await alert.present();
                this.database.GetObras(this.idUsuario);
                } else {
                const alert = await this.alert.create({
                  header: 'SICSEQ',
                  message: 'Credenciales de usuario incorrectas',
                  backdropDismiss: false,
                  buttons: [
                    {
                        text: 'Cerrar',
                        handler: () => {
                            alert.dismiss(true);
                            this.AppComp.logout();
                            return false;
                        }
                    }
                ]
                });
                await alert.present();
                }
              }
        });
      }, 1000);
  } else {
    const alert = await this.alert.create({
      header: 'SICSEQ',
      message: 'No se puede actualizar la información por problemas de red',
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
  }
  this.AppComp.descargarFlag = 0;
}
}
