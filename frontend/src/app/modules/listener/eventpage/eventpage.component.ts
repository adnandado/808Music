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
import * as L from 'leaflet';

@Component({
  selector: 'app-eventpage',
  templateUrl: './eventpage.component.html',
  styleUrl: './eventpage.component.css'
})
export class EventpageComponent {
  ArtistEvents: ArtistEvents[] = [];
  selectedEvent: ArtistEvents | null = null;
  artistData: any | null = null;
  mapInstance: L.Map | null = null;

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
    if (this.selectedEvent) {
      setTimeout(() => {
        this.initMap(this.selectedEvent!);
      }, 3500);}
  }

  selectEvent(event: ArtistEvents) {
    this.selectedEvent = event;
    this.initMap(event);
  }

  initMap(event: ArtistEvents) {
    const mapElement = document.getElementById('map');

    if (this.mapInstance) {
      this.mapInstance.remove();
    }

    const customIcon = L.icon({
      iconUrl: 'https://th.bing.com/th/id/R.81f20b3f073d38c550b0938686909785?rik=rsNHhb6EvzomoQ&riu=http%3a%2f%2fclipart-library.com%2fimage_gallery2%2fKanye-West-PNG-Pic.png&ehk=xOLiNla8XPcrGhjryB7yA2GB%2bdHvVldfG1U%2fLLj016Y%3d&risl=&pid=ImgRaw&r=0',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    const map = L.map('map').setView([event.latitude, event.longitude], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.marker([event.latitude, event.longitude], { icon: customIcon }).addTo(map)
      .bindPopup(`<b>${event.eventTitle}</b><br>${event.city}, ${event.country}`)
      .openPopup();

    this.mapInstance = map;
  }

  protected readonly MyConfig = MyConfig;
  protected readonly format = format;
  protected readonly moment = moment;
}
