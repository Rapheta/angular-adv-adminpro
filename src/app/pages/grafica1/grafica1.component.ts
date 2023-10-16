import { Component } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  public data1 = {
    labels: ['Pan', 'Refesco', 'Tacos'],
    datasets: [
      { data: [10, 15, 40], backgroundColor: ['#6857E6','#009FEE','#F02059'] }
    ]
  }

  public data2 = {
    labels: ['Vino', 'Pizza', 'Galletas'],
    datasets: [
      { data: [80, 95, 110], backgroundColor: ['#41D5FE','#7FFE41','#F434FF'] }
    ]
  }

}
