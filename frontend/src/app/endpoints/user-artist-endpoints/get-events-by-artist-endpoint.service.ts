import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ArtistEvents {
  id: number;
  city: string;
  country: string;
  eventDate: string;
  venue: string;
  eventCover?: string;
  eventTitle : string;
}

@Injectable({
  providedIn: 'root'
})
export class EventGetByArtistIdService {
  private apiUrl = 'http://localhost:7000/api/EventGetByArtistEndpoint/api/EventGetByArtist'; // Tvoj backend URL

  constructor(private http: HttpClient) {}
ngOnInit() {}
  getEventsByArtist(artistId: number): Observable<ArtistEvents[]> {
    return this.http.get<ArtistEvents[]>(`${this.apiUrl}/${artistId}`);
  }
}
