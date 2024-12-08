import { Injectable } from '@angular/core';
import {ArtistSimpleDto} from './auth-services/dto/artist-dto';

@Injectable({
  providedIn: 'root'
})
export class ArtistHandlerService {

  constructor() { }

  isArtistSelected() {
    return this.getSelectedArtist() == null ? false : true;
  }

  setSelectedArtist(artist: ArtistSimpleDto | null) {
    if(artist != null) {
      window.sessionStorage.setItem('artist', JSON.stringify(artist));
    }
    else
    {
      window.sessionStorage.setItem('artist', '');
    }
  }

  getSelectedArtist():ArtistSimpleDto | null {
    let artist: ArtistSimpleDto | null = null;
    let artistString = window.sessionStorage.getItem("artist") ?? '';
    if(artistString === '')
      return null;
    return JSON.parse(artistString);
  }
}
