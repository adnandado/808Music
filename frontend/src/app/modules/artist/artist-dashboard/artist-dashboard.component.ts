import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  GetArtistDashboardEndpointService, GetArtistDashboardRequest,
  GetArtistDashboardResponse
} from '../../../endpoints/artist-endpoints/artist-dashboard-stats-endpoint.serrvice';
import {ArtistHandlerService} from '../../../services/artist-handler.service';
import moment from 'moment';

@Component({
  selector: 'app-artist-dashboard',
  templateUrl: './artist-dashboard.component.html',
  styleUrls: ['./artist-dashboard.component.css']
})
export class ArtistDashboardComponent implements OnInit {
  artistId!: number;
  artistDashboardData: GetArtistDashboardResponse | null = null;
  loading: boolean = false;
  errorMessage: string | null = null;
  currentDate: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private artistDashboardService: GetArtistDashboardEndpointService,
    private artistHandlerService : ArtistHandlerService,
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

  loadArtistDashboardData(): void {
    this.loading = true;
    const request: GetArtistDashboardRequest = { artistId: this.artistId };
    this.artistDashboardService.handleAsync(request).subscribe(
      (response: GetArtistDashboardResponse) => {
        this.loading = false;
        if (response.success) {
          this.artistDashboardData = response;
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

  protected readonly moment = moment;
}
