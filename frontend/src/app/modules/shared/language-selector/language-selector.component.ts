import {Component, OnInit} from '@angular/core';
import {MatSelectChange} from '@angular/material/select';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.css'
})
export class LanguageSelectorComponent implements OnInit {
  placeholder: string = "";

  constructor(protected translateService: TranslateService) {
  }

  ngOnInit() {
    this.getPlaceholder();
    console.log(this.translateService.currentLang);
  }

  setLang(e: MatSelectChange) {
    this.translateService.use(e.value as string)
    window.localStorage.setItem('lang', e.value as string);
  }

  getPlaceholder() {
    this.translateService.get('LANG-SELECT.Placeholder').subscribe(value => {
      this.placeholder = value as string;
    })
  }
}
