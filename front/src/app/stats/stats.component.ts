import {Component, OnInit} from '@angular/core';
import * as CanvasJS from '../../assets/canvasjs.min';
import {AlumnusService} from '../alumnus/service/alumnus.service';
import {DataService} from './service/data.service';


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  constructor(private alumnusService: AlumnusService,
              private dataService: DataService) {
  }

  ngOnInit() {
    let chart: CanvasJS.Chart;
    chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: 'average salary by option'
      },
      data: [{
        type: 'column',
        dataPoints: this.dataService.createDataSalaryByOption(this.alumnusService.getAlumnus()),
      }]
    });

    chart.render();


    const chart2 = new CanvasJS.Chart('chart2Container', {
      animationEnabled: true,
      title: {
        text: 'Companies'
      },
      data: [{
        type: 'pie',
        startAngle: 240,
        yValueFormatString: '##0.00"%"',
        indexLabel: '{label} {y}',
        dataPoints: this.dataService.createCompaniesRepartition(this.alumnusService.getAlumnus())
      }]
    });
    chart2.render();


  }



}
