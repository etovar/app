import { Component, OnInit, ElementRef } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { BdService } from '../../services/bd/bd.service';
import { AppComponent } from '../../app.component';
import { ActivatedRoute } from '@angular/router';
import domtoimage from 'dom-to-image';
import * as jsPDF from 'jspdf';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-genera-integracion',
  templateUrl: './genera-integracion.page.html',
  styleUrls: ['./genera-integracion.page.scss'],
})
export class GeneraIntegracionPage implements OnInit {
  private imageurl = '/assets/img/contraloria.jpg';
  idusuario: any;
  idObra: any;
  idComite: any;
  municipioGrl: any;
  localidadGrl: any;
  fechaGrl: any;
  programaGrl: any;
  nombreObraGrl: any;
  numObraGrl: any;
  montoInversiongrl: any;
  fondoGrl: any;
  periodoEjecucionGrl: any;
  nombreNormativaGrl: any;
  nombreEjecutoraGrl: any;
  firmaEjecutoraGrl: any;
  firmaNormativaGrl: any;
  cargoEjecutoraGrl: any;
  cargoNormativaGrl: any;
  firmaPresidenteGrl: any;
  nombreOrganoEstatal: any;
  cargoOrganoEstatal: any;
  firmaOrganoEstatal: any;
  inicioObraGrl: any;
  finObraGrl: any;
  integrantesGrl = [];
  dataIntegrantes: any;
  dataIntegrantesPrimeraPagina = [];
  dataIntegrantesProximasPaginas = [];
  dataIntegrantesProximosFinal = [];
  loading: any;
  totalHojas = 0;
  // tslint:disable-next-line:max-line-length
  constructor(private elem: ElementRef, private loadingController: LoadingController, private menu: MenuController, private database: BdService, public appc: AppComponent, public activatedRoute: ActivatedRoute, private file: File, private fileOpener: FileOpener) { }

  ngOnInit() {
    this.menu.enable(true, 'custom');
    this.menu.close();
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.idObra = queryParams.idObra;
      this.idComite = queryParams.idComite;
    });
    this.idusuario = this.appc.iduser;
    this.firmaPresidenteGrl = null;
    this.database.GetActaIntegracionGrlInfo(this.idObra, this.idComite, this.idusuario).then((data) => {
      this.municipioGrl = data[0].municipio;
      this.localidadGrl = data[0].localidad;
      this.nombreObraGrl = data[0].nombreObra;
      this.numObraGrl = data[0].numObra;
      this.programaGrl = data[0].programa;
      this.montoInversiongrl = data[0].montoAprobado;
      this.fondoGrl = data[0].fondo;
      this.inicioObraGrl = data[0].inicioObra;
      this.finObraGrl = data[0].terminoObra;
      this.fechaGrl = data[0].fechaComite;
      this.cargoEjecutoraGrl = data[0].cargoEjecutora;
      this.cargoNormativaGrl = data[0].cargoNormativa;
    });
    this.database.GetRepresentantesactaIntegracion(this.idObra, this.idComite, this.idusuario).then((data2) => {
      this.firmaEjecutoraGrl = data2[0].firmaEjecutora;
      this.nombreEjecutoraGrl = data2[0].nombreEjecutora;
      this.nombreNormativaGrl = data2[0].nombreNormativa;
      this.firmaNormativaGrl = data2[0].firmaNormativa;
      this.firmaOrganoEstatal = data2[0].firmaOrganoEstatal;
      this.nombreOrganoEstatal = data2[0].nombreOrganoEstatal;
      this.cargoOrganoEstatal = data2[0].cargoOrganoEstatal;
    });
    this.database.GetIntegrantesActaIntegracion(this.idObra, this.idComite, this.idusuario, 'presidente').then((data3) => {
      this.firmaPresidenteGrl = data3[0].firma;
    });
    this.database.GetIntegrantesActaIntegracion(this.idObra, this.idComite, this.idusuario, 'todos').then((data4) => {
      let numIntegrantes = 0;
      let contador = 0;
      let i = 0;
      this.dataIntegrantes = data4;
      this.dataIntegrantes.forEach(element => {
        if (numIntegrantes < 3) {
          this.dataIntegrantesPrimeraPagina[numIntegrantes] = element;
        } else {
          if (this.dataIntegrantes.length > 3) {
            this.dataIntegrantesProximasPaginas[contador] = element;
            if (contador === 4 || this.dataIntegrantes.length === ((numIntegrantes) + 1)) {
              this.dataIntegrantesProximosFinal[i] = this.dataIntegrantesProximasPaginas;
              this.dataIntegrantesProximasPaginas = [];
              contador = 0;
              i = i + 1;
            } else {
              contador = contador + 1;
            }
          }
        }
        numIntegrantes = numIntegrantes + 1;
      });
      const paginas = (this.dataIntegrantes.length - 3) / 5;
      this.totalHojas = Math.round(paginas + 0.4) + 2;
    });
  }

  async presentLoading(msg) {
    this.loading = await this.loadingController.create({
      message: msg
    });
    return await this.loading.present();
  }

  exportPdf() {
    this.presentLoading('Generando acta...');
    const divPrimero = document.getElementById('paginaPrimera');
    const divFinal = document.getElementById('paginaFinal');
    const docTmp = new jsPDF('p', 'px', 'a4');
    // tslint:disable-next-line:max-line-length
    const options = { background: 'white', height: (docTmp.internal.pageSize.getHeight() + 15) * 1.5, width: ((divPrimero.clientWidth + 5) * 1.5), quality: 1, style: {
      transform: 'scale(1.5)',
      'transform-origin': 'top left'
    }  };
    // tslint:disable-next-line:max-line-length
    const options2 = { background: 'white', height: (docTmp.internal.pageSize.getHeight() + 15) * 1.5, width: ((divFinal.clientWidth + 5) * 1.5), quality: 1, style: {
      transform: 'scale(1.5)',
      'transform-origin': 'top left'
    } };
    // primera hoja
    domtoimage.toPng(divPrimero, options).then((dataUrl) => {
        // Initialize JSPDF
        const doc = new jsPDF('p', 'px', 'a4');
      // ultima hoja
        domtoimage.toPng(divFinal, options2).then((dataUrl2) => {
      // Initialize JSPDF
      // Add image Url to PDF
      const imgHeight = divPrimero.clientHeight *  210 / divPrimero.clientWidth;
      doc.addImage(dataUrl, 'JPEG', 20, 20, doc.internal.pageSize.getWidth() - 50, 600 + 10);
      const elements = this.elem.nativeElement.querySelectorAll('.paginaIntegrantesDinamic');
      if (elements.length === 0) {
        doc.addPage();
        doc.addImage(dataUrl2, 'JPEG', 20, 20, doc.internal.pageSize.getWidth() - 50, 600 + 10);
        const pdfOutput = doc.output();
          // using ArrayBuffer will allow you to put image inside PDF
        const buffer = new ArrayBuffer(pdfOutput.length);
        const array = new Uint8Array(buffer);
        for (let i = 0; i < pdfOutput.length; i++) {
              array[i] = pdfOutput.charCodeAt(i);
          }

          // This is where the PDF file will stored , you can change it as you like
          // for more information please visit https://ionicframework.com/docs/native/file/
        const directory = this.file.dataDirectory ;
        const fileName = 'acta.pdf';
          // tslint:disable-next-line:no-shadowed-variable
        const options: IWriteOptions = { replace: true };

        this.file.checkFile(directory, fileName).then((success) => {
            // Writing File to Device
            this.file.writeFile(directory, fileName, buffer, options)
            // tslint:disable-next-line:no-shadowed-variable
            .then((success) => {
              console.log('File created Succesfully' + JSON.stringify(success));
              this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
                .then(() => console.log('File is opened'))
                .catch(e => console.log('Error opening file', e));
            })
            .catch((error) => {
              console.log('Cannot Create File ' + JSON.stringify(error));
            });
            this.loading.dismiss();
          })
          .catch((error) => {
            // Writing File to Device
            // tslint:disable-next-line:whitespace
            this.file.writeFile(directory, fileName,buffer)
            .then((success) => {
              console.log('File created Succesfully' + JSON.stringify(success));
              this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
                .then(() => console.log('File is opened'))
                .catch(e => console.log('Error opening file', e));
            })
            // tslint:disable-next-line:no-shadowed-variable
            .catch((error) => {
              console.log('Cannot Create File ' + JSON.stringify(error));
            });
          });
      }
      // tslint:disable-next-line:prefer-for-of
      for (let u = 0; u < elements.length; u++) {
        // tslint:disable-next-line:max-line-length
        const optionsDinamic = { background: 'white', height: (docTmp.internal.pageSize.getHeight() + 15) * 1.5, width: ((elements[u].clientWidth + 5) * 1.5), quality: 1, style: {
          transform: 'scale(1.5)',
          'transform-origin': 'top left'
        }  };
        setTimeout(() => {
          domtoimage.toPng(elements[u], optionsDinamic).then((dataUrlDinamic) => {
          const imgHeightDinamic =  elements[u].clientHeight *  210 /  elements[u].clientWidth;
          doc.addPage();
          doc.addImage(dataUrlDinamic, 'JPEG', 20, 20, doc.internal.pageSize.getWidth() - 50,  550 + 10);
        })
        .catch(function(error) {
            this.loading.dismiss();
            console.error('oops, something went wrong!', error);
        });
        }, 1500);
        if (u === ((elements.length) - 1)) {
          setTimeout(() => {
          // Add image Url to PDF
          const imgHeight2 = divFinal.clientHeight *  210 / divFinal.clientWidth;
          doc.addPage();
          doc.addImage(dataUrl2, 'JPEG', 20, 20, doc.internal.pageSize.getWidth() - 50, 400 + 10);
          const pdfOutput = doc.output();
          // using ArrayBuffer will allow you to put image inside PDF
          const buffer = new ArrayBuffer(pdfOutput.length);
          const array = new Uint8Array(buffer);
          for (let i = 0; i < pdfOutput.length; i++) {
              array[i] = pdfOutput.charCodeAt(i);
          }

          // This is where the PDF file will stored , you can change it as you like
          // for more information please visit https://ionicframework.com/docs/native/file/
          const directory = this.file.dataDirectory ;
          const fileName = 'acta.pdf';
          // tslint:disable-next-line:no-shadowed-variable
          const options: IWriteOptions = { replace: true };

          this.file.checkFile(directory, fileName).then((success) => {
            // Writing File to Device
            this.file.writeFile(directory, fileName, buffer, options)
            // tslint:disable-next-line:no-shadowed-variable
            .then((success) => {
              console.log('File created Succesfully' + JSON.stringify(success));
              this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
                .then(() => console.log('File is opened'))
                .catch(e => console.log('Error opening file', e));
            })
            .catch((error) => {
              console.log('Cannot Create File ' + JSON.stringify(error));
            });
            this.loading.dismiss();
          })
          .catch((error) => {
            // Writing File to Device
            // tslint:disable-next-line:whitespace
            this.file.writeFile(directory, fileName,buffer)
            .then((success) => {
              console.log('File created Succesfully' + JSON.stringify(success));
              this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
                .then(() => console.log('File is opened'))
                .catch(e => console.log('Error opening file', e));
            })
            // tslint:disable-next-line:no-shadowed-variable
            .catch((error) => {
              console.log('Cannot Create File ' + JSON.stringify(error));
            });
          });
          }, 5000);
        }
      }
  })
  .catch(function(error) {
      this.loading.dismiss();
      console.error('oops, something went wrong!', error);
  });


    })
    .catch(function(error) {
        this.loading.dismiss();
        console.error('oops, something went wrong!', error);
    });
  }
}
