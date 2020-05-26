import {Component, OnInit} from '@angular/core';
import * as CanvasJS from '../../assets/canvasjs.min';
import {AlumnusService} from '../alumnus/service/alumnus.service';
import {DataService} from './service/data.service';
import {ErrorService} from '../service/error.service';


type chartType = Array<{ y: number, label: string }>;


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  private errorMsg: string;
  private chartTypeData: chartType;

  constructor(private alumnusService: AlumnusService,
              private dataService: DataService,
              private errorService: ErrorService) {

  }



  // @ts-ignore
  async ngOnInit() {
   /* this.dataService.getCharTypeObservable().subscribe(
      el => this.chartTypeData = el,
      error => this.errorMsg = this.errorService.getErrorMessage());*/


    let chart: CanvasJS.Chart;
    chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: 'average salary by option'
      },
      data: [{
        type: 'column',
        dataPoints: this.chartTypeData,
      }]
    });




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
        dataPoints: this.chartTypeData
      }]
    });

    this.dataService.getCharTypeObservable().forEach(
      el => this.chartTypeData = el)
      .then( () => {
        console.log(this.chartTypeData);

        new CanvasJS.Chart('chartContainer', {
            animationEnabled: true,
            exportEnabled: true,
            title: {
              text: 'average salary by option'
            },
            data: [{
              type: 'column',
              dataPoints: this.chartTypeData,
            }]
          }).render();
        new CanvasJS.Chart('chart2Container', {
            animationEnabled: true,
            title: {
              text: 'Companies'
            },
            data: [{
              type: 'pie',
              startAngle: 240,
              yValueFormatString: '##0.00"%"',
              indexLabel: '{label} {y}',
              dataPoints: this.chartTypeData
            }]
          }).render();

      }
      );

  }



}
