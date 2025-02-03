import {Component} from '@angular/core';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import {Router} from '@angular/router';
import {MusicPlayerService} from './services/music-player.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = '808 Music ';
  constructor(private musicPlayer: MusicPlayerService, private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    let lang = window.localStorage.getItem('lang');
    if(lang && lang !== "") {
      this.translate.use(lang);
    }
  }
}
