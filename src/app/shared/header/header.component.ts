import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

declare let $: any; //*****IMPORTANTE DECLARAR variable $

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements AfterViewInit {

  public usuario: Usuario | undefined;

  constructor( private usuarioService: UsuarioService, 
               private router: Router ) {
    this.usuario = usuarioService.usuario;
  }

  ngAfterViewInit(): void {
    //NOTA: esta funcion esta en el archivo "custom.js"
    $(".search-box a, .search-box .app-search .srh-btn").on('click', function () {
      $(".app-search").toggle(200);
    });
  }

  buscar( termino: string ) {
    if ( termino.length === 0  ) {
      return;
    }

    this.router.navigateByUrl(`/dashboard/buscar/${ termino }`);
  }

  logout() {
    this.usuarioService.logout();
  }

}
