import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { ModalController, Platform, NavController } from '@ionic/angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@Component({
  selector: 'app-firma-modal',
  templateUrl: './firma-modal.page.html',
  styleUrls: ['./firma-modal.page.scss'],
})
export class FirmaModalPage implements OnInit {
  @Input() tituloModal: string;
  signature = '';
  isDrawing = false;
  height: any;
  width: any;
  @ViewChild(SignaturePad, null) signaturePad: SignaturePad;
  // tslint:disable-next-line:ban-types
    public signaturePadOptions: Object = {
      minWidth: 2,
      canvasWidth: this.platform.width() - 100,
      canvasHeight: this.platform.height() - 150,
      backgroundColor: '#fff',
      penColor: '#000',
    };
  constructor(public modalCtrl: ModalController, public platform: Platform) {
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss(null);
  }

  ionViewDidEnter() {
    this.signaturePad.clear();
    // this.storage.get('savedSignature').then((data) => {
    // this.signature = data;
    // });
  }

  drawComplete() {
    this.isDrawing = false;
  }

  drawStart() {
    this.isDrawing = true;
  }

  async savePad() {
    this.signature = this.signaturePad.toDataURL();
    // console.log(this.signature);
    // this.storage.set('savedSignature', this.signature);
    this.signaturePad.clear();
    /* const toast =  await this.toastCtrl.create({
      message: 'New Signature saved.',
      duration: 3000
    });
    toast.present(); */
    this.modalCtrl.dismiss(this.signature);
  }

  clearPad() {
    this.signaturePad.clear();
  }
}
