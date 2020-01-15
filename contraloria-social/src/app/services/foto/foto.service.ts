import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { BdService } from '../../services/bd/bd.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

class Photo {
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class FotoService {
  public photos: Photo[] = [];
  fechaHoy = Date.now();
  lat: any;
  lon: any;
  // tslint:disable-next-line:max-line-length
  constructor(private bd: BdService, private camera: Camera, private geolocation: Geolocation) {
  }

  ObtenerFotos(modulo: any, accion: any, idobra: any, idcomite: any, idusuario: any) {
    this.photos = [];
    this.bd.ObtenerFotos(modulo, accion, idobra, idcomite, idusuario).then((data: any[]) => {
     if (data.length > 0) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < data.length; i++) {
        this.photos.unshift({
          data: data[i].foto
        });
      }
    }
      }, (error) => {
        console.log(error);
      });
  }

  deletePicture(pic: any, modulo: any, accion: any, idobra: any, idcomite: any, idusuario: any) {
    this.bd.BorrarFoto(pic, modulo, accion, idobra, idcomite, idusuario);
    const index = this.photos.findIndex( record => record.data === pic );
    this.photos.splice(index, 1);
  }

  takePicture(modulo: any, accion: any, idobra: any, idcomite: any, idusuario: any) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      targetWidth: 800,
      targetHeight: 600,
    };
    this.geolocation.getCurrentPosition().then(response => {
      this.lat = response.coords.latitude;
      this.lon = response.coords.longitude;
    });

    this.camera.getPicture(options).then((imageData) => {
      // tslint:disable-next-line:max-line-length
      this.bd.GuardarFoto('data:image/jpeg;base64,' + imageData, modulo, accion, idobra, idcomite, idusuario, this.fechaHoy, this.lat, this.lon);
      // Add new photo to gallery
      this.photos.unshift({
          data: 'data:image/jpeg;base64,' + imageData
      });
    }, (err) => {
      // Handle error
      console.log('Camera issue: ' + err);
    });
  }
}
