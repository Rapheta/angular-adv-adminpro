import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

//import Swal from 'sweetalert2'; 

import { LoginForm } from 'src/app/interfaces/login-form.interface';
import { UsuarioService } from 'src/app/services/usuario.service';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css'
  ]
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public formSubmitted: boolean = false;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [ Validators.required, Validators.email ] ],
    password: ['', Validators.required ],
    remember: [false]
  });

  constructor( 
    private router: Router, 
    private fb: FormBuilder, 
    private usuarioService: UsuarioService,
    private ngZone: NgZone ) {}

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {

    google.accounts.id.initialize({
      client_id: "763444160659-266iq7nq0qg35eq9su0oh8olkarb4ugh.apps.googleusercontent.com",
      callback: ( response: any ) => this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
      //document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );

  }

  handleCredentialResponse( response: any ) {
    console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle(response.credential)
      .subscribe(resp => {
        
        this.ngZone.run(() => {
          this.router.navigateByUrl('/');
        })

      });
  }

  login() {
    this.formSubmitted = true;

    if( this.loginForm.invalid )
    {
      return;
    }
    
    //Realizar el posteo
    this.usuarioService.login( this.loginForm.value as LoginForm )
      .subscribe( resp => {
        
        if( this.loginForm.get('remember')?.value ){
          localStorage.setItem('email', this.loginForm.get('email')?.value || '' );
        }
        else{
          localStorage.removeItem('email');
        }

        //Navegar al Dashboard
        this.router.navigateByUrl('/');

      }, (err) => console.log( { 
        //Si sucede algún error
        //Swal.fire( 'Error', err.error.msg, 'error' )
      }));
  }

  
}
