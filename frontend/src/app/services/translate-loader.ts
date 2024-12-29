import {TranslateLoader, TranslationObject} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

export class CustomTranslateLoader implements TranslateLoader {
    constructor(private httpClient: HttpClient) {}

    getTranslation(lang: string): Observable<any> {
        return this.httpClient.get(`/i18n/${lang}.json`);
    }

}
