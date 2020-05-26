import {Component, OnInit} from '@angular/core';
import * as CanvasJS from '../../assets/canvasjs.min';
import {Alumnus} from '../model/Alumnus';
import {AlumnusService} from '../alumnus/service/alumnus.service';

type chartType = Array<{ y: number, label: string }>;


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  constructor(private alumnusService: AlumnusService) {
  }

  ngOnInit() {
    const chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: 'average salary by option'
      },
      data: [{
        type: 'column',
        dataPoints: this.createDataSalaryByOption(this.alumnusService.getAlumnus()),
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
        dataPoints: this.createCompaniesRepartition(this.alumnusService.getAlumnus())
      }]
    });
    chart2.render();


  }

  createCompaniesRepartition(allAlumnus: Alumnus[]): chartType {
    const res: chartType = [];

    const listCompanies: string[] = [];
    // We fill the list option with all option
    allAlumnus.map(e => {
        if (listCompanies.find(o => o === e.company) === undefined) {
          listCompanies.push(e.company);
        }
      }
    );
    listCompanies.map(entr => res.push({y: (this.countEntreprise(entr) / allAlumnus.length) * 100, label: entr}));
    return res;
  }

  private countEntreprise(entr: string) {
    return this.alumnusService.getAlumnus().reduce((acc: number, val) => (acc + ((val.company === entr) ? 1 : 0)), 0);
  }

  createDataSalaryByOption(allAlumnus: Alumnus[]) {
    const res: chartType = [];

    const listOptions: string[] = [];
    // We fill the list option with all option
    allAlumnus.map(e => {
        if (listOptions.find(o => o === e.option) === undefined) {
          listOptions.push(e.option);
        }
      }
    );

    listOptions.map(opt => res.push({y: this.countSalary(opt) / this.countOption(opt), label: opt}));
    return res;
  }

  countOption(option: string): number {
    return this.alumnusService.getAlumnus().reduce((acc: number, val) => (acc + ((val.option === option) ? 1 : 0)), 0);
  }

  countSalary(option: string): number {
    return this.alumnusService.getAlumnus().reduce((acc: number, val) => (acc + ((val.option === option) ? +val.wage : 0)), 0);
  }


}
