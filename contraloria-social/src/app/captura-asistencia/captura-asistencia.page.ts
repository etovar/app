import { Component, OnInit } from '@angular/core';
import { MenuController, Platform, NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { AppComponent } from '../app.component';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-captura-asistencia',
  templateUrl: './captura-asistencia.page.html',
  styleUrls: ['./captura-asistencia.page.scss'],
})
export class CapturaAsistenciaPage implements OnInit {
  obra: any;
  comite: any;
  lugar: any;
  municipio: any;
  localidad: any;
  nombre: any;
  public rows: any;
  capturarForm: FormGroup;
  // tslint:disable-next-line:max-line-length
  constructor(public appComp: AppComponent, private formBuilder: FormBuilder, public activatedRoute: ActivatedRoute, private plt: Platform, private location: Location, private menu: MenuController, public navCtrl: NavController) {
    /*this.plt.backButton.subscribe(() => {
      this.location.back();
    });*/
   }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.obra = queryParams.obra;
      this.comite = queryParams.comite;
      this.nombre = queryParams.obra;
      this.localidad = queryParams.localidad;
      this.municipio = queryParams.municipio;
      this.lugar = queryParams.lugar;
      this.appComp.obra = this.obra;
    });
    this.menu.enable(true, 'customComite');
    this.menu.close();
    this.capturarForm = this.formBuilder.group({
        municipio: ['', [Validators.required]],
        localidad: ['', [Validators.required]],
        lugar: ['', [Validators.required]]
    }, {});
    this.rows = [
        {
          participante : 'José Martinez Villareal Villareal',
          cargo : 'Presidente'
      },
      {
        participante : 'José Martinez Villareal Villareal',
        cargo : 'Secretario'
      },
      {
        participante : 'José Martinez Villareal Villareal',
        cargo : 'Presidente'
      },
      {
        participante : 'José Martinez Villareal Villareal',
        cargo : 'Secretario'
      }
    ];
  }

  regresar() {
    this.navCtrl.navigateRoot('comites', {
      queryParams: {
         nombre: this.obra,
         comite: this.comite,
      }
   });
  }

  agregar(value: any) {
    this.municipio = value.municipio;
    this.localidad = value.localidad;
    this.lugar = value.lugar;
    this.navCtrl.navigateRoot('agregar-asistente', {
      queryParams: {
        obra: this.obra,
        comite: this.comite,
        lugar: this.lugar,
        localidad: this.localidad,
        municipio: this.municipio
      }
    });
  }

  borrar(participante: any) {
    console.log(participante + ' borrado');
  }
}
