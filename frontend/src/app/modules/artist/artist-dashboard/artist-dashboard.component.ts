import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  GetArtistDashboardEndpointService, GetArtistDashboardRequest,
  GetArtistDashboardResponse
} from '../../../endpoints/artist-endpoints/artist-dashboard-stats-endpoint.serrvice';
import { ArtistHandlerService } from '../../../services/artist-handler.service';
import moment from 'moment';
import { formatNumber } from '@angular/common';
import { Chart, LinearScale, Title, Tooltip, Legend, LineElement, CategoryScale, PointElement, ArcElement, LineController } from 'chart.js'; // Dodajte LineController
import { trigger, transition, style, animate } from '@angular/animations';

Chart.register(
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  PointElement,
  ArcElement,
  LineController,
);

@Component({
  selector: 'app-artist-dashboard',
  templateUrl: './artist-dashboard.component.html',
  styleUrls: ['./artist-dashboard.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms 0ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms 0ms', style({ opacity: 0 })),
      ])
    ])
  ]
})
export class ArtistDashboardComponent implements OnInit, AfterViewInit {
  artistId!: number;
  artistDashboardData: GetArtistDashboardResponse | null = null;
  loading: boolean = false;
  errorMessage: string | null = null;
  currentDate: Date = new Date();
  selectedDataType: 'productSales' | 'quantitySold' | 'saleAmount' = 'productSales';
  constructor(
    private route: ActivatedRoute,
    private artistDashboardService: GetArtistDashboardEndpointService,
    private artistHandlerService: ArtistHandlerService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const selectedArtist = this.artistHandlerService.getSelectedArtist();
    if (selectedArtist) {
      this.artistId = selectedArtist.id;
    } else {
      this.errorMessage = 'No artist selected';
      this.loading = false;
    }
    this.loadArtistDashboardData();
  }

  ngAfterViewInit(): void {
    if (this.artistDashboardData) {
      this.prepareChartData();
    }
  }

  loadArtistDashboardData(): void {
    this.loading = true;
    const request: GetArtistDashboardRequest = { artistId: this.artistId };
    this.artistDashboardService.handleAsync(request).subscribe(
      (response: GetArtistDashboardResponse) => {
        this.loading = false;
        if (response.success) {
          this.artistDashboardData = response;
          setTimeout(() => {
            this.prepareChartData();
          }, 200);
          this.cdr.detectChanges();

        } else {
          this.errorMessage = response.errorMessage || 'Something went wrong.';
        }
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'An error occurred while fetching the data.';
      }
    );
  }
  nextDataType(): void {
    switch (this.selectedDataType) {
      case 'productSales':
        this.selectedDataType = 'quantitySold';
        break;
      case 'quantitySold':
        this.selectedDataType = 'saleAmount';
        break;
      case 'saleAmount':
        this.selectedDataType = 'productSales';
        break;
    }
  }
  getTableTitle(): string {
    switch (this.selectedDataType) {
      case 'productSales':
        return 'Last 5 Products Sold';
      case 'quantitySold':
        return 'Best Selling Products';
      case 'saleAmount':
        return 'Most Revenue ';
      default:
        return 'Best Selling Products';
    }
  }

  prevDataType(): void {
    switch (this.selectedDataType) {
      case 'productSales':
        this.selectedDataType = 'saleAmount';
        break;
      case 'quantitySold':
        this.selectedDataType = 'productSales';
        break;
      case 'saleAmount':
        this.selectedDataType = 'quantitySold';
        break;
    }
  }
  prepareChartData() {
    const weeklyStats = this.artistDashboardData?.statsByWeek;

    const streamData = weeklyStats?.map(stat => stat.streams);
    const followerData = weeklyStats?.map(stat => stat.followers);
    const revenueData = weeklyStats?.map(stat => stat.revenue);
    const labels = weeklyStats?.map(stat => {
      return moment(stat.weekStart).format('DD/MM') + ' - ' + moment(stat.weekEnd).format('DD/MM');
    });

    this.createChart('streamsChart', streamData!, labels!, 'Streams', 'rgba(153, 102, 255, 1)');
    this.createChart('followersChart', followerData!, labels!, 'Followers', 'rgba(153, 102, 255, 1)');
    this.createChart('revenueChart', revenueData!, labels!, 'Revenue', 'rgba(153, 102, 255, 1)');
  }

  createChart(canvasId: string, data: number[], labels: string[], label: string, borderColor: string) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;

    if (!ctx) {
      console.error(`Canvas element with ID ${canvasId} not found`);
      return;
    }

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
            borderColor: borderColor,
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Weekly ${label} Data`,
            color: 'white'
          },
          legend: {
            labels: {
              color: 'white'
            }
          }
        },
        scales: {
          x: {
            type: 'category',
            labels: labels,
            ticks: {
              color: 'white'
            }
          },
          y: {
            suggestedMin: 0,
            suggestedMax: Math.max(...data),
            ticks: {
              color: 'white'
            }
          }
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
          }
        }
      }
    });
  }



  protected readonly moment = moment;
  protected readonly formatNumber = formatNumber;
}
