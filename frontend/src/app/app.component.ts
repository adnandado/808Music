import {Component} from '@angular/core';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import {Router} from '@angular/router';
import {MusicPlayerService} from './services/music-player.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = '808 Music ';
  constructor(private musicPlayer: MusicPlayerService) {}
}
