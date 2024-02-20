import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

declare const google: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: Usuario | undefined;

  constructor( 
    private http: HttpClient, 
    private router: Router,
    private ngZone: NgZone ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario?.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  logout() {

    localStorage.removeItem('token');

    google.accounts.id.revoke('raphelet1979@gmail.com', () => {
      
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })

    });

  }

  validarToken(): Observable<boolean> {

    const token = this.token;

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': token
      }
    }). pipe(
      map( (resp: any) => {

        const { email, google, nombre, role, img, uid } = resp.usuario;
        this.usuario = new Usuario( nombre, email, '', google, img, role, uid );
        localStorage.setItem('token', resp.token );

        return true;

      }),
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

  actualizarPerfil( data: { email: string, nombre: string, role: string } ) {
    
    data = {
      ...data,
      role: this.usuario!.role || ''
    }

    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, this.headers);

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

  cargarUsuarios( desde: number = 0) {

    return this.http.get<CargarUsuario>(`${ base_url }/usuarios?desde=${ desde }`, this.headers )
      .pipe(
        map( resp => {
          const usuarios = resp.usuarios
            .map( 
              user => new Usuario( user.nombre, user.email, '', user.google, user.img, user.role, user.uid ) 
            );

          return {
            total: resp.total,
            usuarios: usuarios
          };
        })
      );

  }

  eliminarUsuario( usuario: Usuario ){
    
    const url = `${ base_url }/usuarios/${ usuario.uid }`;
    return this.http.delete(url, this.headers);

  }

  guardarUsuario( usuario: Usuario ) {

    return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`, usuario, this.headers);

  }

}