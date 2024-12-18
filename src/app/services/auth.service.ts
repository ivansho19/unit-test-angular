import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  //TODO: email, password

  public login(email: string, password: string): Observable<any> {
    const body = { email, password } 
    return of({
      data: {
        id: 2,
        user: "Ivan"
      }
    })
  }
}
