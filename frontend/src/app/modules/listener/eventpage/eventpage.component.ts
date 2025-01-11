import {Component, Input} from '@angular/core';
import {
  EventGetByArtistIdService, ArtistEvents
} from '../../../endpoints/user-artist-endpoints/get-events-by-artist-endpoint.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MyConfig} from '../../../my-config';
import {ArtistGetByIdEndpointService} from '../../../endpoints/artist-endpoints/artist-get-by-id-endpoint.service';
import {HttpErrorResponse} from '@angular/common/http';
import { format } from 'date-fns';
import moment from 'moment';

@Component({
  selector: 'app-eventpage',
  templateUrl: './eventpage.component.html',
  styleUrl: './eventpage.component.css'
})
export class EventpageComponent {
  ArtistEvents: ArtistEvents[] = [];
  selectedEvent: ArtistEvents | null = null;
  artistData: any | null = null;

  constructor(private eventService: EventGetByArtistIdService, private route :ActivatedRoute, private artistGetByIdEndpointService :ArtistGetByIdEndpointService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let artistId = params['id'];
    this.eventService.getEventsByArtist(artistId).subscribe(
      (data) => {
        this.ArtistEvents = data;
        this.selectClosestEvent();
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );})

    this.route.params.subscribe(params => {
      let artID = params['id'];
      this.artistGetByIdEndpointService.handleAsync(artID as number).subscribe(
        (data: any) => {
          this.artistData = data;
        },
        (error: HttpErrorResponse) => {
          console.error('Error fetching events:', error);
        }
      );
    })

  }

  selectClosestEvent() {
    if (this.ArtistEvents && this.ArtistEvents.length > 0) {
      const now = new Date();
      this.selectedEvent = this.ArtistEvents
        .map((event) => ({
          ...event,
          timeDiff: Math.abs(new Date(event.eventDate).getTime() - now.getTime())
        }))
        .sort((a, b) => a.timeDiff - b.timeDiff)[0];
    }
  }

  // Funkcija za selektiranje eventa pri kliku
  selectEvent(event: ArtistEvents) {
    this.selectedEvent = event;
  }

  protected readonly MyConfig = MyConfig;

  protected readonly format = format;
  protected readonly moment = moment;
}
