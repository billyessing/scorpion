import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { Security } from './../../../shared/models/security.model';
import { Chart } from 'chart.js';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'
import * as firebase from 'firebase/app'

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  user: firebase.User;

  pieChartSecurities = []
  pieChartIndustries = []

  colorScheme = [
    'rgba(230, 25, 75, 0.5)',
    'rgba(60, 180, 75, 0.5)',
    'rgba(255, 225, 25, 0.5)',
    'rgba(0, 130, 200, 0.5)',
    'rgba(245, 130, 48, 0.5)',
    'rgba(145, 30, 180, 0.5)',
    'rgba(70, 240, 240, 0.5)',
    'rgba(255, 215, 180, 0.5)',
    'rgba(210, 245, 60, 0.5)',
    'rgba(250, 190, 190, 0.5)',
    'rgba(230, 190, 255, 0.5)',
    'rgba(0, 0, 128, 0.5)'
  ]

  constructor(private db: FirestoreService) { }

  ngOnInit() {
    this.user = firebase.auth().currentUser;

    this.getPieChartData('pieChartSecurities');
    this.getPieChartData('pieChartIndustries');
  }

  getPieChartData(pieChartType: string) {
    this.db.col$<Security>(`users_data/${this.user.uid}/holdings`)
      .subscribe(col => {

        let securityLabels: string[] = [];
        let securityHoldings: number[] = [];

        col.forEach(doc => {
          if (pieChartType === 'pieChartSecurities') {
            securityLabels.push(doc.code);
            securityHoldings.push(doc.value);
          } else if (pieChartType === 'pieChartIndustries') {
            let index = securityLabels.indexOf(doc.industry);
            if (index < 0) {
              securityLabels.push(doc.industry);
              securityHoldings.push(doc.value);
            } else {
              securityHoldings[index] += doc.value;
            }
          }
        })

        let ctx = document.getElementById(pieChartType);
        pieChartType = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: securityLabels,
            datasets: [{
              label: 'Holdings',
              data: securityHoldings,
              backgroundColor: this.colorScheme
            }],
          },
          options: {
            legend: {
              position: (pieChartType === 'pieChartSecurities' ? 'left' : 'right')
            },
            title: {
              display: true,
              fontSize: 24,
              padding: 20,
              fontFamily: 'Lato',
              fontStyle: 'normal',
              // fontColor: 'white',
              // position: (pieChartType === 'pieChartSecurities' ? 'left' : 'right'),
              text: (pieChartType === 'pieChartSecurities' ? 'Security Holdings' : 'Industry Holdings')
            },
            tooltips: {
        			callbacks: {
        				label: function(tooltipItem, data) {
        					var allData = data.datasets[tooltipItem.datasetIndex].data;
        					var tooltipLabel = data.labels[tooltipItem.index];
        					var tooltipData = allData[tooltipItem.index];
        					var total = 0;
        					for (var i in allData) {
        						total += allData[i];
        					}
        					var tooltipPercentage = Math.round((tooltipData / total) * 100);
        					return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
        				}
        			}
        		}
          }
        });
      })
  }

}
