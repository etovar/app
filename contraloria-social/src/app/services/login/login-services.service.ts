import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginServicesService {
  url = 'http://187.191.68.189/contraloriasocial/app/login.php';

  constructor(private http: HttpClient) { }

  validateLogin(user: string, pass: string): Observable<any> {
    return this.http.get(`${this.url}?u=${user}&p=${pass}`).pipe(
      map(results => results)
    );
  }
}
