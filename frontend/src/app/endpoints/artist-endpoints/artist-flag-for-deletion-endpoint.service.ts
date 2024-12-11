import {Injectable, OnInit} from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';

@Injectable({
  providedIn: 'root'
})

export class ArtistFlagForDeletionEndpointService implements MyBaseEndpointAsync<number, string> {
  readonly url = MyConfig.api_address + '/api/ArtistFlagForDeletionEndpoint';

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(id: number): Observable<string> {
        return this.httpClient.delete(this.url+'/'+id, {responseType: 'text'});
  }
}
