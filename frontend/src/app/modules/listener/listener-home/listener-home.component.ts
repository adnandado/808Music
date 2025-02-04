import {Component, OnInit} from '@angular/core';
import {MyConfig} from '../../../my-config';
import {Params, Router} from '@angular/router';
import {TrackGetAllEndpointService} from '../../../endpoints/track-endpoints/track-get-all-endpoint.service';
import {MusicPlayerService} from '../../../services/music-player.service';
import {MyPagedList} from '../../../services/auth-services/dto/my-paged-list';
import {
  AlbumGetAllEndpointService,
  AlbumGetAllResponse, AlbumPagedRequest
} from '../../../endpoints/album-endpoints/album-get-all-endpoint.service';
import {AlbumGetByIdEndpointService} from '../../../endpoints/album-endpoints/album-get-by-id-endpoint.service';
import {
  ArtistGetAutocompleteEndpointService, UserArtistSearchRequest
} from '../../../endpoints/artist-endpoints/artist-get-autocomplete-endpoint.service';
import {ArtistSimpleDto} from '../../../services/auth-services/dto/artist-dto';
import {
  EventGetUpcomingService,
  UpcomingEvent
} from '../../../endpoints/user-artist-endpoints/event-get-upociming.service';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-listener-home',
  templateUrl: './listener-home.component.html',
  styleUrls: ['../artist-page/artist-music-page/artist-music-page.component.css','./listener-home.component.css'],
  animations: [
    trigger('pageAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.4s ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.5s ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('profileImageAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('0.3s ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]})
export class ListenerHomeComponent implements OnInit {
  userId : number = 0;
  protected readonly MyConfig = MyConfig;
  popularAlbums: MyPagedList<AlbumGetAllResponse> | null = null;
  popularParams: Params = {
    title: "Popular Releases",
    popular: "yes"
  };
  recentAlbums: MyPagedList<AlbumGetAllResponse> | null = null;
  recentParams: Params = {
    title: "Recent Releases",
    popular: "no"
  };
  popularArtists: ArtistSimpleDto[] | null = null;
  popArtistParams: Params = {
    title: "Popular Artists",
    popular: "yes",
    needsToHaveSongs: "yes"
  };
  mostStreamedArtists:  ArtistSimpleDto[] | null = null;
  mostStreamedArtistParams: Params = {
    title: "Most Streamed Artists",
    streams: "yes",
    needsToHaveSongs: "yes"
  }
  private slideInterval: any;
  events : UpcomingEvent [] = [];
  infinitePage = [1];
  currentSlide: number = 0;
  constructor(private router: Router,
              private trackGetAllService: TrackGetAllEndpointService,
              private musicPlayerService: MusicPlayerService,
              private albumGetService: AlbumGetAllEndpointService,
              private artistGetService: ArtistGetAutocompleteEndpointService,
              private eventGetUpcoming : EventGetUpcomingService) {
  }

  ngOnInit(): void {
    this.loadEvents();
    this.userId = this.getUserIdFromToken();
    let request: AlbumPagedRequest  = {pageNumber: 1, pageSize: 50, isReleased: true, title: ""};
      this.albumGetService.handleAsync(request).subscribe({
        next: data => {
          this.recentAlbums = data;
        }
      })
    this.albumGetService.handleAsync({...request, sortByPopularity:true}).subscribe({
      next: data => {
          this.popularAlbums = data;
      }
    })

    this.artistGetService.handleAsync({sortByPopularity: true, returnAmount: 6, searchString:"", needsToHaveSongs:true}).subscribe({
      next: data => {
        this.popularArtists = data;
      }
    })

    this.artistGetService.handleAsync({sortByStreams: true, returnAmount: 6, searchString:"", needsToHaveSongs:true}).subscribe({
      next: data => {
        this.mostStreamedArtists = data;
      }
    })
    this.startAutoSlide();
  }
  ngOnDestroy(): void {
    clearInterval(this.slideInterval);
  }
  loadEvents(): void {
    this.eventGetUpcoming.getUpcomingEvents().subscribe({
      next: (data) => {
        this.events = data;
        console.log(this.events);
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });
  }

  nextSlide(): void {
    if (this.events.length > 0) {
      this.currentSlide = (this.currentSlide + 1) % this.events.length;
    }
  }

  prevSlide(): void {
    if (this.events.length > 0) {
      this.currentSlide = (this.currentSlide - 1 + this.events.length) % this.events.length;
    }
  }
  private startAutoSlide(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 10000);
  }
  changeSlide(index: number): void {
    this.currentSlide = index;
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

  loadMore() {
    this.infinitePage.push(this.infinitePage[this.infinitePage.length-1]+1);
    console.log("Scrolled")
  }
}
