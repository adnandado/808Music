import {Component, Input, OnInit} from '@angular/core';
import {TrackGetResponse} from '../../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';
import {SecondsToDurationStringPipe} from '../../../../services/pipes/seconds-to-string.pipe';
import {MatSliderDragEvent} from '@angular/material/slider';
import {MusicPlayerService} from '../../../../services/music-player.service';
import {interval} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../../../my-config';
import {MyUserAuthService} from '../../../../services/auth-services/my-user-auth.service';

@Component({
  selector: 'app-music-controller',
  templateUrl: './music-controller.component.html',
  styleUrl: './music-controller.component.css'
})
export class MusicControllerComponent implements OnInit {
  jwt: string = "";
  track : TrackGetResponse | null = null;
  trackLocation = `${MyConfig.api_address}/api/TrackStreamEndpoint?TrackId=`;
  secondsPipe = new SecondsToDurationStringPipe();
  currentPlaybackTime: number = 0;
  playingState = false;
  isShuffled = false;
  player : HTMLAudioElement | null = null;

  //Stream counting control vars
  streamCounted = false;
  streamedSec = 0;
  lastStreamIncrement = 0;
  secondsNeeded = 10;


  constructor(private musicPlayerService: MusicPlayerService,
              private httpClient : HttpClient,
              private auth: MyUserAuthService) {
  }

  ngOnInit(): void {
      this.player = document.getElementById("player") as HTMLAudioElement;
      this.jwt = this.auth.getAuthToken()?.token ?? "";
      console.log(this.player);
      let previousVolume = Number.parseFloat(window.localStorage.getItem("music-volume") ?? "0.5");
      if(this.player != null)
      {
        this.player.volume = previousVolume;
      }

      this.track = this.musicPlayerService.getLastPlayedSong();
      let cachedTime = window.localStorage.getItem("currentPlaybackTime");
      if(cachedTime != null)
      {
        this.userSetSlider({value: Number.parseInt(cachedTime)});
      }

      this.musicPlayerService.trackEvent.subscribe({
        next: value => {
          this.track = value;
          if(!this.playingState)
          {
            this.changePlayerState();
          }
          this.streamCounted = false;
          this.streamedSec = 0;
          window.localStorage.setItem("currentPlaybackTime", '0');
        }
      })

      this.isShuffled = this.musicPlayerService.isShuffled;

      this.musicPlayerService.shuffleToggled.subscribe({
        next: value => {
          this.isShuffled = value;
        }
      })

      setInterval(() => {
        if(this.playingState)
        {
          let millis = Date.now();
          if(millis - this.lastStreamIncrement >= 1000)
          {
            this.lastStreamIncrement = millis;
            this.streamedSec++;
            if(this.streamedSec >= this.secondsNeeded && !this.streamCounted)
            {
              this.httpClient.post(MyConfig.api_address + "/api/TrackAddStreamEndpoint/" + this.track?.id, {}).subscribe({
                next: value => {
                  console.log("Stream counted");
                },
                error: err => {
                  console.error('Error occurred:', err);
                  if (err.status === 401 ) {
                    alert('Potrebna vam je aktivna pretplata da biste streamali pjesmu.');
                  } else {
                    console.log('Došlo je do pogreške prilikom dodavanja streama.');
                  }
                }
              });

              this.streamCounted = true;
              this.streamedSec = 0;
          }
          }
        }
        else {
          this.streamedSec = 0;
        }
      }, 250);
  }

  setCurrentPlaybackTime(e: number) {
    this.currentPlaybackTime = e;
    window.localStorage.setItem("currentPlaybackTime", this.currentPlaybackTime.toString());
  }

  changePlayerState() {
    if(this.player != null)
    {
      if(this.playingState) {
        this.playingState = false;
        this.player.pause();
      }
      else {
        this.playingState = true;
        this.player.play().catch((error: Error) => {
          console.log(error);

        });
      }
    }
  }

  setSliderValue(e: Event) {
    if(this.player != null)
    {
      this.currentPlaybackTime = Math.floor(this.player.currentTime);
      window.localStorage.setItem("currentPlaybackTime", this.currentPlaybackTime.toString());
    }
  }

  userSetSlider(event: MatSliderDragEvent | {value: number}) {
    if(this.player != null)
    {
      this.player.currentTime = event.value;
      this.currentPlaybackTime = this.player.currentTime;
      window.localStorage.setItem("currentPlaybackTime", this.currentPlaybackTime.toString());
    }
  }

  setVolume(number: number) {
    if(this.player != null)
    {
      this.player.volume = number;
      window.localStorage.setItem("music-volume",number.toString());
    }
  }

  setLoopState() {
    if(this.player != null)
    {
      this.player.loop = !this.player.loop;
    }
  }

  skipNext() {
    if(this.player != null)
    {
      if(this.player.loop)
      {
        this.player.currentTime = 0;
      }
      else if (!this.isShuffled) {
        if(this.playingState)
        {
          this.changePlayerState();
        }
        this.musicPlayerService.playNext();
      }
      else {
        if(this.playingState)
        {
          this.changePlayerState();
        }
        this.musicPlayerService.shufflePlay();
      }
    }
  }

  skipPrevious() {
    if(this.player != null)
    {
      if(this.player.loop || this.player.currentTime > 2)
      {
        this.player.currentTime = 0;
      }
      else {
        this.musicPlayerService.playPrev();
      }
    }
  }

  getVolumeSliderValue(event: Event) {
    return Number.parseInt((event.target as HTMLInputElement).value)/100
  }

  setShuffleState() {
    this.isShuffled = !this.isShuffled;
  }

  getTrackId() {
    return this.track != null ? this.track.id : -1;
  }
}
