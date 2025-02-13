import { Component, inject, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { BoroughMin, Filter, FilterOptions, PCNMin, PracticeMin } from '../models/filters.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ColumnChartComponent } from '../charts/column-chart/column-chart.component';
import { ChartData } from '../models/dashboarddata.model';

@Component({
  selector: 'app-oneview',
  standalone: true,
  imports: [FormsModule, CommonModule, ColumnChartComponent],
  templateUrl: './oneview.component.html',
  styleUrl: './oneview.component.scss'
})
export class OneviewComponent {

  @ViewChild('chart') chart!: ColumnChartComponent;
  public filters: FilterOptions = { boroughs: [], pcNs: [], practices: []};
  selectedBorough: number  = 0 ;
  selectedPcn: number = 0;
  selectedPractice: number = 0;
  selectedIndicator: string = '';
  uniqueIndicators: string[] = [];
  chartData: ChartData[] = [];
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getFilters().subscribe(response => {
      this.filters = response;
      this.getData();
    })
  }

  onBoroughChanged(event: any) {
    this.getData();
  }

  onPcnChanged(event: any) {
    this.getData();
  }

  onpracticeChanged(event: any) {
    this.getData();
  }

  getData(){
    let filter: Filter = {
      Borough: this.selectedBorough,
      PCN: this.selectedPcn,
      Practice: this.selectedPractice
    }
    this.dataService.getData(filter).subscribe(response => {
      var data: ChartData[] = [];
      response.pcnScores.forEach(element => {
        if(this.uniqueIndicators.findIndex(_ => _ == element.indicator) == -1){
          this.uniqueIndicators.push(element.indicator);
        }
        let pcn = this.filters.pcNs.find(_ => _.id == element.pcnId);
        let borough = this.filters.boroughs.find(_ => _.id == element.boroughId);
        if(pcn && borough) {
          data.push({ pcn: pcn?.name , score: element.score, borough: borough.name, min: element.min, max: element.max, indicator: element.indicator });
        }
      });
      this.chartData = data;
      this.selectedIndicator = this.uniqueIndicators[0];
      data = data.filter(_ => _.indicator == this.selectedIndicator);
      this.updateChartData(data);
    })
  }

  resetFilters() {
    this.selectedBorough = 0;
    this.selectedPcn = 0;
    this.selectedPractice = 0;
    this.getData();
  }

  updateChartData(data: ChartData[]): void {
    this.chart.updateData(data);
  }

  onIndicatorChanged(event: any) {
    this.selectedIndicator = event.target.value;
    let filteredChartData = [...this.chartData];
    filteredChartData = filteredChartData.filter(_ => _.indicator == this.selectedIndicator);
    this.updateChartData(filteredChartData);
  }
}