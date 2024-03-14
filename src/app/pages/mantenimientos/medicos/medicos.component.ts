import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import Swal from 'sweetalert2';

import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy{

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  public imgSubs!: Subscription;

  constructor( 
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
                    .pipe(
                      delay(100)
                    )
                    .subscribe( img => {
                      this.cargarMedicos()
                    } );
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe( medicos => {
        this.cargando = false;
        this.medicos = medicos;
      } )
  }

  buscar( termino: string ) {

    if( termino.length === 0) {
      return this.cargarMedicos();
    }
    else {
      this.busquedasService.buscar( 'medicos', termino )
        .subscribe( resultados => {
          this.medicos = resultados;
        } )
    }

  }

  borrarMedico( medico: Medico ) {
    
    Swal.fire({
      title: "¿Borrar medico?",
      text: `Esta a punto de borrar a ${medico.nombre}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borrarlo"
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico(medico._id!)
          .subscribe( resp => {

            this.cargarMedicos();

            Swal.fire(
              'Medico borrado',
              `${ medico.nombre } fue eliminado correctamente`,
              'success'
              ); 
              
          } 
        );
      }
    });

  }

  abrirModal( medico: Medico ){
    this.modalImagenService.abrirModal('medicos', medico._id!, medico.img);
  }

}
