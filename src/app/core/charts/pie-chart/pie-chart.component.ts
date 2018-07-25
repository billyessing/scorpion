import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { Security } from './../../../shared/models/security.model';
import { Chart } from 'chart.js';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  chartType: 'pie';
  pieChart = []
  colorScheme = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(255, 159, 64, 0.5)'
  ]

  constructor(private db: FirestoreService) { }

  ngOnInit() {
    this.getPieChartData();
  }


  getPieChartData() {
    this.db.col$<Security>('holdings')
      .subscribe(col => {

        let securityCodes: string[] = [];
        let securityHoldings: number[] = [];

        col.forEach(doc => {
          securityCodes.push(doc.code);
          securityHoldings.push(doc.value);
        })

        let ctx = document.getElementById("pieChart");
        this.pieChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: securityCodes,
            datasets: [{
              label: 'Holdings',
              data: securityHoldings,
              backgroundColor: this.colorScheme
            }],
          },
          options: {
            legend: {
              position: 'right'
            }
          }
        });
      })
  }

}
