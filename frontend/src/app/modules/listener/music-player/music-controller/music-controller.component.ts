import {Component, Input, OnInit} from '@angular/core';
import {TrackGetResponse} from '../../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';
import {SecondsToDurationStringPipe} from '../../../../services/pipes/seconds-to-string.pipe';
import {MatSliderDragEvent} from '@angular/material/slider';

@Component({
  selector: 'app-music-controller',
  templateUrl: './music-controller.component.html',
  styleUrl: './music-controller.component.css'
})
export class MusicControllerComponent implements OnInit {
  @Input() track : TrackGetResponse | null = null;
  @Input() trackLocation = "";
  secondsPipe = new SecondsToDurationStringPipe();
  currentPlaybackTime: number = 0;
  playingState = false;
  player : HTMLAudioElement | null = null;

  ngOnInit(): void {
      this.player = document.getElementById("player") as HTMLAudioElement;
      console.log(this.player);
      let previousVolume = Number.parseFloat(window.localStorage.getItem("music-volume") ?? "0.5");
      if(this.player != null)
      {
        this.player.volume = previousVolume;
      }
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
      else {

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

      }
    }
  }
}
