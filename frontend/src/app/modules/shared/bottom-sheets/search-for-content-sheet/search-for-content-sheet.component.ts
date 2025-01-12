import {Component, inject, OnInit} from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {
  TrackGetAllEndpointService,
  TrackGetAllRequest
} from '../../../../endpoints/track-endpoints/track-get-all-endpoint.service';
import {
  AlbumGetAllEndpointService,
  AlbumPagedRequest
} from '../../../../endpoints/album-endpoints/album-get-all-endpoint.service';
import {
  ArtistGetAutocompleteEndpointService, UserArtistSearchRequest
} from '../../../../endpoints/artist-endpoints/artist-get-autocomplete-endpoint.service';
import {map} from 'rxjs';
import {MyConfig} from '../../../../my-config';
import {MessageContent} from '../../message-content-card/message-content-card.component';

@Component({
  selector: 'app-search-for-content-sheet',
  templateUrl: './search-for-content-sheet.component.html',
  styleUrl: './search-for-content-sheet.component.css'
})
export class SearchForContentSheetComponent implements OnInit{
  private sheetRef = inject<MatBottomSheetRef<SearchForContentSheetComponent>>(MatBottomSheetRef);
  results: MessageContent[] = [];

  albumPagedRequest: AlbumPagedRequest = {
    title: '',
    isReleased: true,
    pageNumber: 1,
    pageSize: 2,
    sortByPopularity: true,
  }

  trackPagedRequest: TrackGetAllRequest = {
    title: "",
    isReleased: true,
    pageNumber: 1,
    pageSize: 2,
    sortByStreams: true,
  }

  artistRequest: UserArtistSearchRequest = {
    searchString: "",
    sortByStreams: true,
    returnAmount: 2,
    needsToHaveSongs: true
  }

  constructor(private trackGetService : TrackGetAllEndpointService,
              private albumGetService : AlbumGetAllEndpointService,
              private artistGetService: ArtistGetAutocompleteEndpointService,
              ) {
  }

  ngOnInit(): void {
    this.results = [];
    //Get albums
    this.albumGetService.handleAsync(this.albumPagedRequest).pipe(
      map(val => val.dataItems.map((item, i) =>
      {return {name: item.title, type: "Album", picture: `${MyConfig.api_address}${item.coverArt}`, id: item.id};} ))
    ).subscribe({next: value =>
        this.results.push(...value)
    });

    //Get tracks
    this.trackGetService.handleAsync(this.trackPagedRequest).pipe(
      map(val => val.dataItems.map((item, i) =>
      {return {name: item.title, type: "Track", picture: `${MyConfig.api_address}${item.coverPath}`, id: item.id};} ))
    ).subscribe({next: value =>
        this.results.push(...value)
    });

    this.artistGetService.handleAsync(this.artistRequest).pipe(
      map(val => val.map((item, i) =>
      {return {name: item.name, type: "Artist", picture: `${MyConfig.api_address}${item.pfpPath}`, id: item.id};} ))
    ).subscribe({next: value =>
        this.results.push(...value)
    });
  }

  dismiss() {
    this.sheetRef.dismiss(null);
  }

  findContent($event: string) {
    this.albumPagedRequest.title = $event;
    this.trackPagedRequest.title = $event;
    this.artistRequest.searchString = $event;
    this.ngOnInit();
  }

  attachContent(a: MessageContent | null) {
    this.sheetRef.dismiss(a);
  }
}
