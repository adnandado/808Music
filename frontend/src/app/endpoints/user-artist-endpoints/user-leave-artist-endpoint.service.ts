import {Injectable, OnInit} from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserLeaveArtistEndpointService implements MyBaseEndpointAsync<number, string> {
  readonly url = MyConfig.api_address + '/api/UserLeaveArtistEndpoint';

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: number): Observable<string> {
        return this.httpClient.delete(this.url+"/"+request, {responseType: 'text'});
    }
}
