import {Component, OnInit} from '@angular/core';
import * as CanvasJS from '../../assets/canvasjs.min';
import {AlumnusService} from '../alumnus/service/alumnus.service';
import {DataService} from './service/data.service';
import {ErrorService} from '../service/error.service';


type chartType = Array<{ y: number, label: string }>;


function creataeRender() {

}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  errorMsg: string;
  private chartTypeData: chartType;
  public label = 'option';
  public y = 'wage';
  allLabels: string[];
  labelValue: any;
  valueValue: any;
  allValue: string[];


  constructor(private alumnusService: AlumnusService,
              private dataService: DataService,
              private errorService: ErrorService) {

  }


  async ngOnInit() {

    this.allLabels = ['option', 'company', 'country', 'city', 'job', 'campus'];
    this.allValue = ['wage', 'graduation'];

    this.dataService.getCharTypeObservable(this.label, this.y).forEach(
      el => this.chartTypeData = el)
      .then(() => {
          new CanvasJS.Chart('chartContainer', {
            animationEnabled: true,
            exportEnabled: true,
            title: {
              text: 'Average ' + this.y + ' by ' + this.label
            },
            data: [{
              type: 'column',
              dataPoints: this.chartTypeData,
            }]
          }).render();
        }
      );
  }

  requestLabel($event: any) {
    this.label = $event;

    this.dataService.getCharTypeObservable(this.label, this.y).forEach(
      el => this.chartTypeData = el)
      .then(() => {
        new CanvasJS.Chart('chartContainer', {
          animationEnabled: true,
          exportEnabled: true,
          title: {
            text: 'Average ' + this.y + ' by ' + this.label
          },
          data: [{
            type: 'column',
            dataPoints: this.chartTypeData,
          }]
        }).render();
      });

  }


  requestY($event: any) {
    this.y = $event;

    this.dataService.getCharTypeObservable(this.label, this.y).forEach(
      el => this.chartTypeData = el)
      .then(() => {
        new CanvasJS.Chart('chartContainer', {
          animationEnabled: true,
          exportEnabled: true,
          title: {
            text: 'Average ' + this.y + ' by ' + this.label
          },
          data: [{
            type: 'column',
            dataPoints: this.chartTypeData,
          }]
        }).render();
      });

  }
}
