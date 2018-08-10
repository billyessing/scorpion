import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { SecurityDataService } from './../../../shared/services/security-data.service';
import { CsvParserService } from './../../../shared/services/csv-parser.service';

import { Security } from './../../../shared/models/security.model';
import { Chart } from 'chart.js';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

const timePeriods = [
  '1day', '5days', '1month',
  '3months', '6months', '1year', '5year'
];

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  @Input() securityCode: string;

  // default value
  timePeriod: string = '5days';
  lineChart: any;

  constructor(
    private securityService: SecurityDataService,
    private csvService: CsvParserService
  ) { }

  ngOnInit() {
    this.getLineChartData(this.timePeriod);
  }

  updateTimePeriod(tab: any) {
    let timePeriod = timePeriods[tab['index']]

    if (this.lineChart) {
      this.lineChart.destroy();
      this.lineChart = null;
    }

    this.getLineChartData(timePeriod);

    // this.lineChart.update();
  }

  getLineChartData(timePeriod) {
    this.securityService.getHistoricalSecurityData(this.securityCode, timePeriod)
      .throttleTime(1000)
      .subscribe(data => {

        let canvas = <HTMLCanvasElement> document.getElementById("lineChart");
        let ctx = canvas.getContext("2d");

        this.lineChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: data['dates'],
            datasets: [{
              label: this.securityCode.toUpperCase(),
              data: data['prices'],
              backgroundColor: this.getColor(ctx, data['prices'])['gradient'],
              borderColor: this.getColor(ctx, data['prices'])['lineColor']
            }],
          },
          options: {
            legend: {
              position: 'right',
              display: false
            },
            elements: {
              point: {
                radius: 0,
                hitRadius: 5,
                hoverRadius: 5
              },
              line: { tension: 0 }
            },
            scales: {
              xAxes: [{
                ticks: {
                  stepSize: 5
                },
                gridLines: {
                  display: false
                }
              }],
              yAxes: [{
                ticks: {
                  suggestedMin: (Math.min(...data['prices']) * 0.998),
                },
                gridLines: {
                  lineWidth: 0.4
                }
              }]
            }
          }
        });
      },
      err => console.log("could not fetch line chart data...")
    )
  }

  getColor(ctx, data: number[]): any {
    let gradient = ctx.createLinearGradient(0, 0, 0, 280);
    let lineColor;

    if (Number(data[0]) < Number(data[data.length - 1])) {
      gradient.addColorStop(0, 'rgba(75,181,67,0.4)');
      gradient.addColorStop(1, 'rgba(75,181,67,0.02)');
      lineColor = 'rgba(75,181,67,0.3)'
    } else {
      gradient.addColorStop(0, 'rgba(255,0,0,0.4)');
      gradient.addColorStop(1, 'rgba(255,0,0,0.02)');
      lineColor = 'rgba(255,0,0,0.3)'
    }

    return { gradient, lineColor };
  }

}
