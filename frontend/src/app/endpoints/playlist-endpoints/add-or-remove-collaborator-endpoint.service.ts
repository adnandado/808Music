  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
  import { HttpClient } from '@angular/common/http';
  import { MyConfig } from '../../my-config';

  export interface AddOrRemoveCollabRequest {
    ownerId: number;
    collaboratorId: number;
    playlistId: number;
  }

  export interface AddOrRemoveCollabResponse {
    success: boolean;
    message: string;
  }

  @Injectable({
    providedIn: 'root',
  })
  export class PlaylistAddOrRemoveCollaboratorService {
    private readonly url = `${MyConfig.api_address}/api/PlaylistAddCollaboratorEndpoint`;

    constructor(private httpClient: HttpClient) {}

    handleAsync(request: AddOrRemoveCollabRequest): Observable<AddOrRemoveCollabResponse> {
      return this.httpClient.put<AddOrRemoveCollabResponse>(this.url, request);
    }
  }
