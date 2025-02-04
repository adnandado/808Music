import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import html2canvas from 'html2canvas';
import {
  GetUserMonthlyStatsEndpointService,
  UserMonthlyStatsResponse
} from '../../../endpoints/user-endpoints/get-user-monthly-stats-endpoint.service';
import {MyConfig} from '../../../my-config';
import moment from 'moment';

@Component({
  selector: 'app-monthly-stats',
  templateUrl: './monthly-stats-dialog.component.html',
  styleUrls: ['./monthly-stats-dialog.component.css']
})
export class MonthlyStatsDialogComponent implements OnInit {
  @ViewChild('statsContainer', { static: false }) statsContainer!: ElementRef;
  userId = 0;
  statsData!: UserMonthlyStatsResponse;
  themes = [
    { name: 'Theme 1',
      background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
      textColor: '#ffffff',
      monthColor: '#ff2900',
      bottomTextColor: '#ff2900'},{ name: 'Theme 2', background: 'linear-gradient(to right, #6a11cb, #2575fc)', textColor: '#ffffff' },
    { name: 'Theme 3', background: 'linear-gradient(135deg, #68F9AC, #43D854)', listColor: '#0c0c0c',textColor: '#ffffff', monthColor: '#0c0c0c',
      bottomTextColor: '#ffffff' },
    { name: 'Theme 4', background: 'linear-gradient(135deg, #C7A0E5, #8653E0)', textColor: '#ffffff', monthColor: '#51438a',
      bottomTextColor: '#51438a' },
    { name: 'Theme 5', background: 'linear-gradient(135deg, #EBBBF9, #EF9EC5)', textColor: '#ffffff', monthColor: '#ff0283',
      bottomTextColor: '#fd0282' },
  ];


  constructor(private statsService: GetUserMonthlyStatsEndpointService) {}
  currentTheme = this.themes[0];

  ngOnInit(): void {
    this.userId = this.getUserIdFromToken();

    this.statsService.handleAsync(this.userId).subscribe((data) => {
      this.statsData = data;
    });
  }
  private getUserIdFromToken(): number {
    let authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
      authToken = localStorage.getItem('authToken');
    }
    if (!authToken) {
      return 0;
    }
    try {
      const parsedToken = JSON.parse(authToken);
      return parsedToken.userId;
    } catch (error) {
      console.error('Error parsing authToken:', error);
      return 0;
    }
  }
  changeTheme(theme: any) {
    this.currentTheme = theme;
  }
  downloadAsImage(): void {
    console.log('Ušao sam u funkciju');
    html2canvas(this.statsContainer.nativeElement, {
      useCORS: true,
      logging: true,  // Ovo će vam pomoći u praćenju problema
    }).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'monthly_stats.png';
      link.click();
    });

  }

  protected readonly MyConfig = MyConfig;
  protected readonly moment = moment;

  onClose() {

  }
}
