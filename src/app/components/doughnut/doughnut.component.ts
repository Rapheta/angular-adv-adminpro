import { Component, Input } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styles: [
  ]
})
export class DoughnutComponent {

  @Input() title: string = 'Sin titulo';

  // Doughnut
  public doughnutChartLabels: string[] = [
    'Label1',
    'Label2',
    'Label3',
  ];

  @Input('data') doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [0, 0, 0], backgroundColor: ['#FF0000','#00FF00','#0000FF'] }
    ],
  };

}


