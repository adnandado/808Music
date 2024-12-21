import {Component, Input, OnInit} from '@angular/core';
import {TrackGetResponse} from '../../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';
import {SecondsToDurationStringPipe} from '../../../../services/pipes/seconds-to-string.pipe';
import {MatSliderDragEvent} from '@angular/material/slider';
import {MusicPlayerService} from '../../../../services/music-player.service';

@Component({
  selector: 'app-music-controller',
  templateUrl: './music-controller.component.html',
  styleUrl: './music-controller.component.css'
})
export class MusicControllerComponent implements OnInit {
  track : TrackGetResponse | null = null;
  trackLocation = 'http://localhost:7000/api/TrackStreamEndpoint/';
  secondsPipe = new SecondsToDurationStringPipe();
  currentPlaybackTime: number = 0;
  playingState = false;
  isShuffled = false;
  player : HTMLAudioElement | null = null;

  constructor(private musicPlayerService: MusicPlayerService) {
  }

  ngOnInit(): void {
      this.player = document.getElementById("player") as HTMLAudioElement;
      console.log(this.player);
      let previousVolume = Number.parseFloat(window.localStorage.getItem("music-volume") ?? "0.5");
      if(this.player != null)
      {
        this.player.volume = previousVolume;
      }

      this.musicPlayerService.trackEvent.subscribe({
        next: value => {
          this.track = value;
        }
      })

  }

  setCurrentPlaybackTime(e: number) {
    this.currentPlaybackTime = e;
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
        this.player.play();
      }
    }
  }

  setSliderValue(e: Event) {
    if(this.player != null)
    {
      this.currentPlaybackTime = this.player.currentTime;
    }
  }

  userSetSlider(event: MatSliderDragEvent) {
    if(this.player != null)
    {
      this.player.currentTime = event.value;
      this.currentPlaybackTime = this.player.currentTime;
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
        this.musicPlayerService.playNext();
      }
      else {
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
}
