import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject  } from 'rxjs';
import { LoginServicesService } from '../services/login/login-services.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { MenuController } from '@ionic/angular';
import { Location } from '@angular/common';
import { Platform } from '@ionic/angular';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  authenticationState = new BehaviorSubject(false);
  imageurl = '/assets/img/estado.png';
  imageurl1 = '/assets/img/linea.jpg';
  submitted = false;
  authForm: FormGroup;
  message: string;
  username: string;
  password = '';
  results: Observable<any>;
  // tslint:disable-next-line:max-line-length
  constructor(public AppComp: AppComponent, public menuCtrl: MenuController, private screenOrientation: ScreenOrientation, public alert: AlertController, public navCtrl: NavController, private formBuilder: FormBuilder, private login: LoginServicesService, private storage: Storage, private plt: Platform, private location: Location) {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    // nthis.menuCtrl.enable(false);

    /*this.plt.backButton.subscribe(() => {
      this.location.back();
    });*/
   }

  ngOnInit() {
    this.storage.get('login-token').then(res => {
      if (res) {
        this.navCtrl.navigateRoot('home');
      }
    });
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
  }, {});
  }

  checkToken() {
    this.storage.get('login-token').then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    });
  }

  setValoresIniciales(result) {
    this.storage.set('login-token', result.token).then(() => {
      this.authenticationState.next(true);
    });
    this.storage.set('login-usuario', result.user).then(() => {
      this.authenticationState.next(true);
      this.AppComp.usuario = result.user;
    });
    this.storage.set('login-nombre', result.nombre).then(() => {
      this.authenticationState.next(true);
      this.AppComp.nombre = result.nombre;
    });
    this.storage.set('login-rol', result.rol).then(() => {
      this.authenticationState.next(true);
      this.AppComp.rol = result.rol;
    });
    this.storage.set('login-usuario-id', result.id).then(() => {
      this.authenticationState.next(true);
      this.AppComp.iduser = result.id;
    });
    this.storage.set('login-usuario-p', result.pass).then(() => {
      this.authenticationState.next(true);
      this.AppComp.userp = result.pass;
    });
  }

  async onSubmit(value: any) {
    this.username = value.email;
    this.password = value.password + btoa(this.username);
    this.results = this.login.validateLogin(btoa(this.username) as string, btoa(this.password));
    this.results.subscribe(async (result: any)  => {
      this.results.subscribe(
        async (results: any) => {
          // console.log(results);
          result = JSON.parse(result);
          // console.log(result);
          if (result.status === 0) {
            this.authForm.reset();
            const alert = await this.alert.create({
              header: 'SICSEQ',
              message: 'Usuario o contraseña incorrectos',
              backdropDismiss: false,
              buttons: ['Cerrar']
            });
            await alert.present();
          } else {
            if (result.status === 1) {
              if (result.movil === '1') {
                this.setValoresIniciales(result);
                this.authForm.reset();
                this.message = 'Sesión iniciada';
                this.navCtrl.navigateRoot('home');
              } else {
                this.authForm.reset();
                const alert = await this.alert.create({
                  header: 'SICSEQ',
                  message: 'El usuario no tiene permisos para acceder a la aplicación',
                  backdropDismiss: false,
                  buttons: ['Cerrar']
                });
                await alert.present();
              }
            }
          }
        });
    });
  }
}
