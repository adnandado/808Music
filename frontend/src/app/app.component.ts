import {Component, OnDestroy, OnInit} from '@angular/core';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import {Router} from '@angular/router';
import {MusicPlayerService} from './services/music-player.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subscription} from 'rxjs';
import {Track} from '@khajegan/ngx-audio-player';
import {TrackGetResponse} from './endpoints/track-endpoints/track-get-by-id-endpoint.service';
import { Title } from '@angular/platform-browser';
import {MyConfig} from './my-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = '808 Music';
  titleElement!: HTMLTitleElement;
  iconElement!: HTMLLinkElement;
  iconName = "favicon.ico"

  track: TrackGetResponse | null = null;
  playState = false;

  track$!: Subscription;
  playingState$!: Subscription;

  constructor(private musicPlayer: MusicPlayerService, private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    let lang = window.localStorage.getItem('lang');
    if(lang && lang !== "") {
      this.translate.use(lang);
    }
  }

  ngOnInit(): void {
    this.titleElement = document.getElementById("app-title") as HTMLTitleElement;
    this.iconElement = document.getElementById("app-icon") as HTMLLinkElement;

    this.track = this.musicPlayer.getLastPlayedSong();

    this.track$ = this.musicPlayer.trackEvent.subscribe(track => {
      this.track = track;
      this.handleTitle();
      this.handleFavicon();
    })
    this.playingState$ = this.musicPlayer.playStateChange.subscribe(state => {
      this.playState = state;
      this.handleTitle();
      this.handleFavicon();
    })
  }

  ngOnDestroy(): void {
    this.track$.unsubscribe();
    this.playingState$.unsubscribe();
  }

  handleTitle(): void {
    this.titleElement.text = this.playState ?
      `${this.track!.title} ● ${this.track!.artists.map(val => val.name).join(', ')}`
    :
      this.title;
  }

  handleFavicon(): void{
    if(this.playState){
      this.iconElement.href = this.track ? `${MyConfig.api_address}${this.track.coverPath}` : this.iconName;
    }
    else {
      this.iconElement.href = this.iconName;
    }
  }
}
