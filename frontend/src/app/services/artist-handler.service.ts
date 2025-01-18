import { Injectable } from '@angular/core';
import {ArtistSimpleDto} from './auth-services/dto/artist-dto';
import {Subject} from 'rxjs';
import {MyConfig} from '../my-config';

@Injectable({
  providedIn: 'root'
})
export class ArtistHandlerService {
  private artistSelectedPfp = new Subject<string>();
  public artistSelectedPfp$ = this.artistSelectedPfp.asObservable();

  constructor() { }

  isArtistSelected() {
    return this.getSelectedArtist() != null;
  }

  setSelectedArtist(artist: ArtistSimpleDto | null) {
    if(artist != null) {
      window.sessionStorage.setItem('artist', JSON.stringify(artist));
      this.artistSelectedPfp.next(`${MyConfig.api_address}${artist.pfpPath}`)
    }
    else
    {
      window.sessionStorage.setItem('artist', '');
      this.artistSelectedPfp.next(``);
    }
  }

  getSelectedArtist():ArtistSimpleDto | null {
    let artist: ArtistSimpleDto | null = null;
    let artistString = window.sessionStorage.getItem("artist") ?? '';
    if(artistString === '') {
      return null;
    }
    return JSON.parse(artistString);
  }
}
