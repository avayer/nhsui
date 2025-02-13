// column-chart.component.ts
import { Component, ElementRef, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { ChartData } from '../../models/dashboarddata.model';


type D3Selection = d3.Selection<SVGGElement, unknown, null, undefined>;
type D3ScaleLinear = d3.ScaleLinear<number, number>;
type D3ScaleBand = d3.ScaleBand<string>;

@Component({
  selector: 'app-column-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <svg #chartSvg></svg>
    </div>
  `,
  styles: [`
       .chart-container {
      width: 100%;
      min-width: 1200px;
      height: 600px;
      margin: 20px;
      overflow-x: auto;
    }
    
    .bar:hover {
      opacity: 0.8;
    }

    .min-marker {
      fill: #ff4444;
    }

    .max-marker {
      fill: #44ff44;
    }

    .marker-line {
      stroke-width: 2px;
    }

    .tooltip {
      position: absolute;
      padding: 8px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      pointer-events: none;
      font-size: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class ColumnChartComponent implements OnInit {
  private chartData = signal<ChartData[]>([]);
  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private readonly margin = { top: 20, right: 120, bottom: 60, left: 60 };
  private readonly width = 1000;
  private readonly height = 500;

  private readonly chartWidth = computed(() => 
    this.width - this.margin.left - this.margin.right
  );

  private readonly chartHeight = computed(() => 
    this.height - this.margin.top - this.margin.bottom
  );

  constructor(private elementRef: ElementRef<HTMLElement>) {
    effect(() => {
      if (this.chartData()) {
        this.createChart();
      }
    });
  }

  ngOnInit(): void {
    this.createChart();
  }
  

  private createChart(): void {
    // Remove any existing chart
    d3.select(this.elementRef.nativeElement).select('svg').remove();
    d3.select(this.elementRef.nativeElement).select('.tooltip').remove();

    // Create tooltip
    const tooltip = d3.select(this.elementRef.nativeElement)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // Create SVG
    this.svg = d3.select(this.elementRef.nativeElement)
      .select('.chart-container')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const chartArea = this.svg
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    const data = this.chartData();
    if (!data.length) return;

    // Get unique boroughs and categories
    const boroughs = Array.from(new Set(data.map(d => d.borough)));
    const categories = Array.from(new Set(data.map(d => d.pcn)));

    // Create scales
    const x0 = d3.scaleBand()
      .domain(categories)
      .rangeRound([0, this.chartWidth()])
      .paddingInner(0.3)
      .paddingOuter(0.2);

    const x1 = d3.scaleBand()
      .domain(boroughs)
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([this.chartHeight(), 0]);

    // Color scale for different boroughs
    const color = d3.scaleOrdinal<string>()
      .domain(boroughs)
      .range(d3.schemeSet3);

    // Add X axis
    chartArea.append('g')
      .attr('transform', `translate(0,${this.chartHeight()})`)
      .call(d3.axisBottom(x0))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    // Add Y axis
    chartArea.append('g')
      .call(d3.axisLeft(y)
        .tickValues([0, 20, 40, 60, 80, 100])
        .tickFormat(d => `${d}%`));

    // Add gridlines
    chartArea.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .tickSize(-this.chartWidth())
        .tickFormat(() => ''))
      .style('stroke-dasharray', '3,3')
      .style('stroke-opacity', 0.2);

    // Create PCN groups
    const pcnGroups = chartArea.selectAll('.pcn')
      .data(categories)
      .enter().append('g')
      .attr('class', 'pcn')
      .attr('transform', d => `translate(${x0(d)},0)`);

    // Create bar groups
    const barGroups = pcnGroups.selectAll('.bar-group')
      .data(pcn => {
        return data.filter(d => d.pcn === pcn)
          .map(d => ({...d, pcn}));
      })
      .enter()
      .append('g')
      .attr('class', 'bar-group');

      chartArea.append('text')
  .attr('class', 'x-axis-label')
  .attr('x', this.chartWidth() / 2)
  .attr('y', this.chartHeight() + 50) // Position below X axis
  .style('text-anchor', 'middle')
  .style('font-size', '14px')
  .text('NCL PCNs'); // Replace with your desired X-axis label

// Add Y axis label
chartArea.append('text')
  .attr('class', 'y-axis-label')
  .attr('transform', 'rotate(-90)') // Rotate text for vertical label
  .attr('x', -(this.chartHeight() / 2))
  .attr('y', -40) // Position to the left of Y axis
  .style('text-anchor', 'middle')
  .style('font-size', '14px')
  .text('Percentage Achieved YTD');

    // Create bars
    barGroups.append('rect')
      .attr('class', 'bar')
      .attr('x', d => x1(d.borough) || 0)
      .attr('y', d => y(d.score))
      .attr('width', x1.bandwidth())
      .attr('height', d => this.chartHeight() - y(d.score))
      .attr('fill', d => color(d.borough))
      .on('mouseover', (event: MouseEvent, d: any) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`
          <strong>${d.pcn} - ${d.borough}</strong><br/>
          Value: ${d.score}%<br/>
          Min: ${d.min}<br/>
          Max: ${d.max}
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

      const createDiamond = (x: number, y: number, size: number): string => {
        return `M ${x} ${y-size}
                L ${x+size} ${y}
                L ${x} ${y+size}
                L ${x-size} ${y}
                Z`;
      };

      barGroups.append('path')
      .attr('class', 'marker min-marker')
      .attr('d', d => {
        const x = (x1(d.borough) || 0) + x1.bandwidth()/ 2;
        return createDiamond(x, y(d.min), 4); // Size of 4 for the diamond
      })
      .style('stroke', '#ff4444')
      .style('stroke-width', '1px');

    // Add max markers (diamonds)
    barGroups.append('path')
      .attr('class', 'marker max-marker')
      .attr('d', d => {
        return createDiamond(((x1(d.borough) || 0) + x1.bandwidth() / 2), y(d.max), 4); // Size of 4 for the diamond
      })
      .style('stroke', '#44ff44')
      .style('stroke-width', '1px');
      
    // Add legend
    const legend = this.svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${this.width - this.margin.right + 10},${this.margin.top})`);

    // Borough colors legend
    legend.selectAll('.borough-color')
      .data(boroughs)
      .enter()
      .append('g')
      .attr('class', 'borough-color')
      .attr('transform', (d, i) => `translate(0,${i * 20})`)
      .call(g => {
        g.append('rect')
          .attr('width', 12)
          .attr('height', 12)
          .attr('fill', d => color(d));
        g.append('text')
          .attr('x', 20)
          .attr('y', 10)
          .text(d => d);
      });

    // Min/Max markers legend
    const markerLegend = legend.append('g')
      .attr('transform', `translate(0,${boroughs.length * 20 + 20})`);

    // Min marker legend
    markerLegend.append('line')
      .attr('x1', 0)
      .attr('x2', 12)
      .attr('y1', 6)
      .attr('y2', 6)
      .style('stroke', '#ff4444')
      .style('stroke-width', '2px');

    markerLegend.append('text')
      .attr('x', 20)
      .attr('y', 10)
      .text('Minimum');

    // Max marker legend
    markerLegend.append('line')
      .attr('x1', 0)
      .attr('x2', 12)
      .attr('y1', 26)
      .attr('y2', 26)
      .style('stroke', '#44ff44')
      .style('stroke-width', '2px');

    markerLegend.append('text')
      .attr('x', 20)
      .attr('y', 30)
      .text('Maximum');
  }

  public updateData(newData: ChartData[]): void {
    this.chartData.set(newData);
  }
  
}
