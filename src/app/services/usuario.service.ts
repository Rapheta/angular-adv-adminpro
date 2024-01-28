import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';

declare const google: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( 
    private http: HttpClient, 
    private router: Router,
    private ngZone: NgZone ) { }

  logout() {

    localStorage.removeItem('token');

    google.accounts.id.revoke('raphelet1979@gmail.com', () => {
      
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })

    });

  }

  validarToken(): Observable<boolean> {

    const token = localStorage.getItem('token') || '';

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': token
      }
    }). pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token )
      }),
      map( resp => true ),
      catchError( error => of(false) )
    );

  }

  crearUsuario( formData: RegisterForm ) {
    
    return this.http.post(`${ base_url }/usuarios`, formData)
                .pipe(
                  tap( (resp: any ) => {
                    localStorage.setItem('token', resp.token )
                  })
                );

  }

  login( formData: LoginForm ) {
    
    return this.http.post(`${ base_url }/login`, formData)
                .pipe(
                  tap( (resp: any ) => {
                    localStorage.setItem('token', resp.token )
                  })
                );

  }

  loginGoogle( token: string ) {

    return this.http.post(`${ base_url }/login/google`, { token })
                .pipe(
                  tap( (resp: any ) => {
                    localStorage.setItem('token', resp.token )
                  })
                );

  }

}
