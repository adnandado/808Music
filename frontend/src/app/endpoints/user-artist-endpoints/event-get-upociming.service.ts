import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';

export interface UpcomingEvent {
  id: number;
  city: string;
  country: string;
  eventDate: string;
  venue: string;
  eventCover?: string;
  eventTitle: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root',
})
export class EventGetUpcomingService {
  private apiUrl = `${MyConfig.api_address}/api/EventGetUpcomingEndpoint`;

  constructor(private http: HttpClient) {}

  getUpcomingEvents(): Observable<UpcomingEvent[]> {
    return this.http.get<UpcomingEvent[]>(this.apiUrl);
  }
}
