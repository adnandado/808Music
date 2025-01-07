import {Component, Input, OnInit} from '@angular/core';
import {TrackGetResponse} from '../../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-track-card-list',
  templateUrl: './track-card-list.component.html',
  styleUrls: ['../../../listener/artist-page/artist-music-page/artist-music-page.component.css','../../artist/artist-big-card-list/artist-big-card-list.component.css','./track-card-list.component.css']
})
export class TrackCardListComponent implements OnInit{
  @Input() tracks : TrackGetResponse[] = [];
  @Input() artistMode: boolean = false;
  title: string = "Songs";

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  viewAll(b: boolean) {

  }
}
