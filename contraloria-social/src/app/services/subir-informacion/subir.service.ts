import { Injectable } from '@angular/core';
import { BdService } from '../bd/bd.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { File } from '@ionic-native/file/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Injectable({
  providedIn: 'root'
})
export class SubirService {
  url = 'http://187.191.68.189/contraloriasocial/app/subir_informacion.php';
  urlPDF = 'http://187.191.68.189/contraloriasocial/app/descargarPDF.php';

  downloadFile: any;
  fileTransfer: FileTransferObject;
  // tslint:disable-next-line:max-line-length
  constructor(private file: File, private database: BdService, private http: HttpClient, private fileOpener: FileOpener, private transfer: FileTransfer, private androidPermissions: AndroidPermissions, private platform: Platform) { }

  // tslint:disable-next-line:max-line-length
  enviarInformacionComite(idLocal: any, idObra: any, idComite: any, idUsuario: any, user: any, pass: any, rol: any): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.post(this.url, JSON.stringify({user, idUser: idUsuario, userP: pass, listaAsisttencia: this.database.listaAsisttenciaTmp, evidenciaComite: this.database.evidenciaComiteTmp, evidenciaIntegracion: this.database.evidenciaIntegracionTmp, evidenciaCapacitacion: this.database.evidenciaCapacitacionTmp, fotoIntegracion: this.database.fotoIntegracionTmp, fotoCapacitacion: this.database.fotoCapacitacionTmp, integracionComites: this.database.integracionComitesTmp, integranteIntegracion: this.database.integranteIntegracionTmp, testigoIntegracion: this.database.testigoIntegracionTmp, capacitacionComites: this.database.capacitacionComitesTmp, integranteCapacitacion: this.database.integranteCapacitacionTmp, participanteCapacitacion: this.database.participanteCapacitacionTmp, tokenComite: this.database.tokenComite, idComite, idObra, rol
    }) , {}).pipe(map(res => res));
  }

  descargarACTA(acta: any, idObra: any, idComite: any, idUsuario: any) {
      let dir: any;
      if (this.platform.is('ios')) {
          dir = this.file.documentsDirectory;
      }

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
          result => {
              if (!result.hasPermission) {
                  // tslint:disable-next-line:max-line-length
                  const permissionRequested = this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
              }
          }
      );

      dir = this.file.externalRootDirectory + '/Download/Actas_SICSEQ/';

      this.fileTransfer = this.transfer.create();

      if (acta !== 'ambas') {
        this.fileTransfer.download(this.urlPDF, dir + acta + '_' + idComite + '_' + idUsuario + '.pdf', true).then((entry) => {
          // tslint:disable-next-line:max-line-length
          this.database.UpdateComitesActaGenerada(idComite, idObra, idUsuario, dir + acta + '_' + idComite + '_' + idUsuario + '.pdf', acta);
        // console.log('download completed: ' + entry.toURL());
        }, (error) => {
            this.database.UpdateComitesActaGenerada(idComite, idObra, idUsuario, 'error', acta).then((data) => {
              console.log(error);
              this.fileTransfer
                .download(this.urlPDF, dir + acta + '_' + idComite + '_' + idUsuario + '.pdf', true)
                .then(entry => {
                  this.fileOpener
                    .open(entry.toURL(), 'application/pdf')
                    .then(() => console.log('File is opened'))
                    .catch(e => console.log('Error opening file', e));
                });
            });
        });
      } else {
        this.fileTransfer.download(this.urlPDF, dir + 'integracion_' + idComite + '_' + idUsuario + '.pdf', true).then((entryInt) => {
          // tslint:disable-next-line:max-line-length
          this.database.UpdateComitesActaGenerada(idComite, idObra, idUsuario, dir + 'integracion_' + idComite + '_' + idUsuario + '.pdf', 'integracion').then((dataInt) => {



            this.fileTransfer.download(this.urlPDF, dir + 'capacitacion_' + idComite + '_' + idUsuario + '.pdf', true).then((entryCap) => {
              // tslint:disable-next-line:max-line-length
              this.database.UpdateComitesActaGenerada(idComite, idObra, idUsuario, dir + 'capacitacion_' + idComite + '_' + idUsuario + '.pdf', 'capacitacion');
            }, (error) => {
              this.database.UpdateComitesActaGenerada(idComite, idObra, idUsuario, 'error', 'capacitacion').then((data) => {
                console.log(error);
                this.fileTransfer
                  .download(this.urlPDF, dir + 'capacitacion_' + idComite + '_' + idUsuario + '.pdf', true)
                  .then(entryCap => {
                    this.fileOpener
                      .open(entryCap.toURL(), 'application/pdf')
                      .then(() => console.log('File is opened'))
                      .catch(e => console.log('Error opening file', e));
                  });
              });
          });




          });
        // console.log('download completed: ' + entry.toURL());
        }, (error) => {
            this.database.UpdateComitesActaGenerada(idComite, idObra, idUsuario, 'error', 'integracion').then((data) => {
              console.log(error);
              this.fileTransfer
                .download(this.urlPDF, dir + 'integracion_' + idComite + '_' + idUsuario + '.pdf', true)
                .then(entryInt => {
                  this.fileOpener
                    .open(entryInt.toURL(), 'application/pdf')
                    .then(() => console.log('File is opened'))
                    .catch(e => console.log('Error opening file', e));
                });
            });
        });
      }

      /* this.fileTransfer
      .download(this.urlPDF, dir + 'acta_dos.pdf', true)
      .then(entry => {
        console.log('download complete: ' + entry.toURL());
        this.fileOpener
          .open(entry.toURL(), 'application/pdf')
          .then(() => console.log('File is opened'))
          .catch(e => console.log('Error opening file', e));
      }, (error) => {
        // here logging our error its easier to find out what type of error occured.
        console.log(error);
    }); */
  }
}
