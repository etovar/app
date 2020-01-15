import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BdService } from '../bd/bd.service';

@Injectable({
  providedIn: 'root'
})
export class DescargarService {
  url = 'http://187.191.68.189/contraloriasocial/app/descargar_obra.php';

  constructor(private bd: BdService, private http: HttpClient) {
  }

  // tslint:disable-next-line:max-line-length
  descargarObras(user: any, rol: number, identificador: number, pass: string, idusuario: any): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.post(this.url, JSON.stringify({user, rol, idUser: identificador, userP: pass, obrasApp: this.bd.arrayObrasApp, comitesApp: this.bd.arrayComitesApp, comitesHabilitadosApp: this.bd.arrayComitesHabilitadosApp
    }), {}).pipe(map(res => res));
  }
}
