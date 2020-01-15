import { Injectable } from '@angular/core';
import { BdService } from '../bd/bd.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubirService {
  url = 'http://187.191.68.189/contraloriasocial/app/subir_informacion.php';

  constructor(private database: BdService, private http: HttpClient) { }

  // tslint:disable-next-line:max-line-length
  enviarInformacionComite(idLocal: any, idObra: any, idComite: any, idUsuario: any, user: any, pass: any, rol: any): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.post(this.url, JSON.stringify({user, idUser: idUsuario, userP: pass, listaAsisttencia: this.database.listaAsisttenciaTmp, evidenciaComite: this.database.evidenciaComiteTmp, evidenciaIntegracion: this.database.evidenciaIntegracionTmp, evidenciaCapacitacion: this.database.evidenciaCapacitacionTmp, fotoIntegracion: this.database.fotoIntegracionTmp, fotoCapacitacion: this.database.fotoCapacitacionTmp, integracionComites: this.database.integracionComitesTmp, integranteIntegracion: this.database.integranteIntegracionTmp, testigoIntegracion: this.database.testigoIntegracionTmp, capacitacionComites: this.database.capacitacionComitesTmp, integranteCapacitacion: this.database.integranteCapacitacionTmp, participanteCapacitacion: this.database.participanteCapacitacionTmp, tokenComite: this.database.tokenComite, idComite, idObra, rol
    }) , {}).pipe(map(res => res));
  }
}
