import { Injectable } from '@angular/core';

export interface ArtistTrackDto {
  id: number;
  name: string;
  profilePhotoPath: string;
  isLead: boolean;
}

export interface TrackGetResponse {
  id: number;
  title: string;
  length: number;
  streams: number;
  isExplicit: boolean;
  coverPath: string;
  artists: ArtistTrackDto[];
}

@Injectable({
  providedIn: 'root'
})
export class TrackGetByIdEndpointService {

  constructor() { }
}
