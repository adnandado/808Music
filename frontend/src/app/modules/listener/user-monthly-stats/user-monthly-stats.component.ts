import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import html2canvas from 'html2canvas';
import {
  GetUserMonthlyStatsEndpointService,
  UserMonthlyStatsResponse
} from '../../../endpoints/user-endpoints/get-user-monthly-stats-endpoint.service';
import {MyConfig} from '../../../my-config';
import moment from 'moment';

@Component({
  selector: 'app-user-monthly-stats',
  templateUrl: './user-monthly-stats.component.html',
  styleUrls: ['./user-monthly-stats.component.css']
})
export class UserMonthlyStatsComponent implements OnInit {
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
  gifUrls: string[] = [
    'https://th.bing.com/th/id/R.3e505a007bc34662288f30527bae719f?rik=BaGv1L0UN7WtFQ&riu=http%3a%2f%2fpixel.nymag.com%2fimgs%2fdaily%2fvulture%2f2015%2f03%2f09%2fkanye-gif%2fkanye-dance-3.nocrop.w529.h554.gif&ehk=z6ufsBQewPcHDcyZ6Kr1ewDXb5pVqeUVNsHznmuBRQI%3d&risl=&pid=ImgRaw&r=0',
    'https://media1.tenor.com/m/xB9QRoz8pZgAAAAC/kendrick-kendrick-lamar.gif',
    'https://media.tenor.com/u2NXoBYqmrAAAAAd/kendrick-kendrick-lamar.gif',
    'https://media2.giphy.com/media/939qYREfqFEvqZ04DT/giphy.gif',
    'https://media.giphy.com/media/mJIZ5nRwlztaE/giphy.gif',
    'https://media0.giphy.com/media/lxhf8w0tcmdnh1FpiT/200.gif?cid=6c09b9523j8n59gjcz6ivxj7vsg5uib35g1l6zrloc8atuu7&ep=v1_gifs_search&rid=200.gif&ct=g',
    'https://media3.giphy.com/media/YhSVi82JQiuFa/giphy.gif?cid=6c09b9525usw25ajta5kfilfdszvt2hxqrn4j8kgiiaomivu&ep=v1_gifs_search&rid=giphy.gif&ct=g'
  ];

  selectedGif: string = '';

  constructor(private statsService: GetUserMonthlyStatsEndpointService) {}
  currentTheme = this.themes[0];

  ngOnInit(): void {
    this.userId = this.getUserIdFromToken();
    this.selectedGif = this.getRandomGif();

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
      logging: true,
    }).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'monthly_stats.png';
      link.click();
    });

  }
  getRandomGif(): string {
    const randomIndex = Math.floor(Math.random() * this.gifUrls.length);
    return this.gifUrls[randomIndex];
  }
  protected readonly MyConfig = MyConfig;
  protected readonly moment = moment;
}
