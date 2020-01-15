import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { BehaviorSubject  } from 'rxjs';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { MenuController } from '@ionic/angular';
import { BdService } from './services/bd/bd.service';
import { AlertController } from '@ionic/angular';
import { OfflineService } from './services/offline/offline.service';
import { DescargarService } from './services/descargar-obra/descargar.service';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  authenticationState = new BehaviorSubject(false);
  usuario: any;
  nombre: any;
  rol: any;
  obra: any;
  iduser: number;
  userp: any;
  rolUsuario: any;
  results: any;
  descargarFlag: any;
  constructor(
    private loadingController: LoadingController,
    private menu: MenuController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    private storage: Storage,
    private screenOrientation: ScreenOrientation,
    private database: BdService,
    private offline: OfflineService,
    public alert: AlertController,
    private descargarObra: DescargarService
  ) {

    this.storage.get('login-usuario').then(res2 => {
      if (res2) {
        this.usuario = res2;
      }
      this.storage.get('login-rol').then(res3 => {
        if (res3) {
          this.rol = res3;
          if (this.rol === 1) {
            this.rolUsuario = 'Ejecutora';
          } else {
            this.rolUsuario = 'Contraloria';
          }
        }
        this.storage.get('login-nombre').then(res4 => {
          if (res4) {
            this.nombre = res4;
          }
          // tslint:disable-next-line:no-shadowed-variable
          this.storage.get('login-usuario-id').then(res4 => {
            if (res4) {
              this.iduser = res4;
            }
            // tslint:disable-next-line:no-shadowed-variable
            this.storage.get('login-usuario-p').then(res4 => {
              if (res4) {
                this.userp = res4;
              }
              this.storage.get('login-token').then(res => {
                if (res === null) {
                  this.navCtrl.navigateRoot('login');
                  this.descargarFlag = 2;
                } else {
                  this.descargarFlag = 1;
                }
                this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
                this.initializeApp();
              });
            });
          });
        });
      });
    });
  }

  ngOnInit() {
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    if (this.descargarFlag === 1) {
      setTimeout(() => {
        this.descargar();
      }, 100);
    }
  }

  logout() {
    this.storage.remove('login-token').then(() => {
      this.authenticationState.next(false);
      this.storage.remove('login-usuario').then(() => {
        this.authenticationState.next(false);
        this.storage.remove('login-rol').then(() => {
          this.authenticationState.next(false);
          this.storage.remove('login-usuario-id').then(() => {
            this.authenticationState.next(false);
            this.storage.remove('login-usuario-p').then(() => {
              this.authenticationState.next(false);
            });
          });
        });
      });
    });
    this.menu.close();
    this.navCtrl.navigateRoot('login');
    this.descargarFlag = 2;
  }

  obras() {
    this.menu.close();
    this.navCtrl.navigateRoot('home');
  }

  comites() {
    this.menu.close();
    this.navCtrl.navigateRoot('comites', {
      queryParams: {
        nombre : this.obra
      }
    });
  }

  comitesEstatus() {
    this.menu.close();
    this.navCtrl.navigateRoot('comites-estatus');
  }

  async descargar() {
    this.database.arrayComitesHabilitadosApp = [];
    this.database.arrayObrasApp = [];
    this.database.arrayComitesApp = [];
    this.database.GetAppInfo(this.iduser).then(async (data) => {
    let msgDescarga = '';
    if (this.offline.getCurrentNetworkStatus() === 0) {
      setTimeout(() => {
          // tslint:disable-next-line:max-line-length
      this.results = this.descargarObra.descargarObras(this.usuario, this.rol, this.iduser, this.userp, this.iduser);
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
                      // tslint:disable-next-line:no-shadowed-variable
                      this.database.FindObra(this.iduser, obra.id_obra).then(async (data) => {
                        if (data === 'nuevo') {
                          // tslint:disable-next-line:max-line-length
                          this.database.InsertarObra(null, obra.id_obra, obra.num_obra, obra.nombre_obra, obra.mmunicipio, obra.localidad, obra.status_obra, obra.monto_aprobado, obra.fondo, obra.ejecutora, obra.normativa, obra.inicio_obra, obra.termino_obra, this.iduser, obra.lat, obra.lon, obra.tipofondo, obra.token, obra.programa);
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
                      this.database.ActualizarObraActualizacion(obra.id_obra, this.iduser, obra);
                    }
                  }

                  if (results.obrasActualizarTokenCambio !== null) {
                    if (results.obrasActualizarTokenCambio.length > 0) {
                      // tslint:disable-next-line:max-line-length
                      msgDescarga = msgDescarga + results.obrasActualizarTokenCambio.length + ' obras actualizadas con cambios importantes<br>';
                    }
                    // tslint:disable-next-line:prefer-const
                    for (let obra of results.obrasActualizarTokenCambio) {
                      this.database.ActualizarObraActualizacion(obra.id_obra, this.iduser, obra);
                    }
                  }

                  if (results.obrasBorrados !== null) {
                    let obrasBorradasTotal = 0;
                    // tslint:disable-next-line:prefer-const
                    for (let obra of results.obrasBorrados) {
                      // tslint:disable-next-line:no-shadowed-variable
                      this.database.ValidarBorradoIdObra(obra.idObra, this.iduser).then((data) => {
                        if (data === 1) {
                          this.database.BorrarObraActualizacion(obra.idObra, this.iduser);
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
                      // tslint:disable-next-line:no-shadowed-variable
                      this.database.FindComite(this.iduser, comite.obra_id, comite.id_comite).then(async (data) => {
                        if (data === 'nuevo') {
                          // tslint:disable-next-line:max-line-length
                          this.database.InsertarComite(null, comite.contraloria_usuario_id, comite.agenda_confirmada, comite.origen, comite.id_comite, comite.num_comite, comite.metodo, comite.obra_id, comite.status, comite.agenda_fecha, comite.agenda_hora_inicio, comite.agenda_hora_fin, comite.usuario_id, comite.id_obra, comite.fondo, comite.norma_cs_aplica, this.iduser, comite.normativa, comite.metodo_contraloria, comite.contraloria_asistente, comite.token,  comite.cargo_ejecutora, comite.cargo_normativa);
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
                      this.database.ActualizarComiteActualizacion(comite.obra_id, comite.id_comite, this.iduser, comite);
                    }
                  }

                  if (results.comitesActualizarTokenCambio !== null) {
                    if (results.comitesActualizarTokenCambio.length > 0) {
                      // tslint:disable-next-line:max-line-length
                      msgDescarga = msgDescarga + results.comitesActualizarTokenCambio.length + ' comites actualizados con cambios importantes<br>';
                    }
                    // tslint:disable-next-line:prefer-const
                    for (let comite of results.comitesActualizarTokenCambio) {
                      this.database.ActualizarComiteActualizacion(comite.obra_id, comite.id_comite, this.iduser, comite);
                    }
                  }

                  if (results.comitesBorrados !== null) {
                    if (results.comitesBorrados.length > 0) {
                      msgDescarga = msgDescarga + results.comitesBorrados.length + ' comites actualizados borrados<br>';
                    }
                    // tslint:disable-next-line:prefer-const
                    for (let comite of results.comitesBorrados) {
                      this.database.BorrarComiteActualizacion(comite.IdObra, comite.idComite, this.iduser);
                    }
                  }

                  const alert = await this.alert.create({
                    header: 'SICSEQ',
                    message: 'Descarga exitosa<br>' + msgDescarga,
                    backdropDismiss: false,
                    buttons: ['Cerrar']
                  });
                  await alert.present();
                  this.database.GetObras(this.iduser);
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
                              this.logout();
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
        buttons: ['Cerrar']
      });
      await alert.present();
    }
    this.descargarFlag = 0;
  });
}
}
