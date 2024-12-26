import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MyConfig} from '../../../my-config';
import {
  ArtistTrackDto,
  TrackGetByIdEndpointService,
  TrackGetResponse
} from '../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {TrackWithPositionDto} from '../../../services/auth-services/dto/TrackWithPositionDto';
import {ArtistSimpleDto} from '../../../services/auth-services/dto/artist-dto';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {TrackDeleteEndpointService} from '../../../endpoints/track-endpoints/track-delete-endpoint.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfirmDialogComponent} from '../dialogs/confirm-dialog/confirm-dialog.component';
import {
  TrackGetAllEndpointService,
  TrackGetAllRequest
} from '../../../endpoints/track-endpoints/track-get-all-endpoint.service';
import {MyPagedList} from '../../../services/auth-services/dto/my-paged-list';
import {PageEvent} from '@angular/material/paginator';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ShareBottomSheetComponent} from '../bottom-sheets/share-bottom-sheet/share-bottom-sheet.component';
import {MusicPlayerService} from '../../../services/music-player.service';

@Component({
  selector: 'app-tracks-table',
  templateUrl: './tracks-table.component.html',
  styleUrl: './tracks-table.component.css',
})
export class TracksTableComponent implements OnInit, OnChanges {
  @Input() inArtistMode = true;
  @Input() isPlaylist = false;
  protected readonly MyConfig = MyConfig;
  @Input() tracks: TrackGetResponse[] = [];
  tracksDto: TrackWithPositionDto[] = []
  displayedColumns = ["position", "main-control", "title", "artist-controls", "duration", "streams"];
  dataSource = new MatTableDataSource<TrackWithPositionDto>(this.tracksDto);
  @Output() onMainClick: EventEmitter<number> = new EventEmitter();
  matDialog: MatDialog = inject(MatDialog);
  snackBar: MatSnackBar = inject(MatSnackBar);
  pagedResponse: MyPagedList<TrackGetResponse> | null = null;
  @Input() pagedRequest: TrackGetAllRequest = {
    pageNumber: 1,
    pageSize: 20,
  }
  @Output() onCreateClick: EventEmitter<void> = new EventEmitter();
  paginationOptions = [20, 35, 50]
  @Input() reload = true;
  shouldDisplayControls = false;
  isShuffled = false;
  @Input() allowPagination = true;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private getTrackService: TrackGetByIdEndpointService,
              private deleteTrackService: TrackDeleteEndpointService,
              private getAllTracksService: TrackGetAllEndpointService,
              private btmSheet : MatBottomSheet,
              private musicPlayerService : MusicPlayerService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(this.reload)
      {
          console.log("changes");
          this.reloadData();

      }
    }

  reloadData() {
    this.reload = false;
    if(this.isPlaylist) {

    }
    else
    {
      this.getAllTracksService.handleAsync(this.pagedRequest).subscribe({
        next: data => {
          this.pagedResponse = data;
          this.tracks = data.dataItems;
          this.tracksDto = [];
          for(let i = 0; i < this.tracks.length; i++) {
            this.tracksDto.push({
              artists: this.tracks[i].artists,
              id: this.tracks[i].id,
              length: this.tracks[i].length,
              coverPath: MyConfig.api_address + this.tracks[i].coverPath,
              position: i+1,
              isExplicit: this.tracks[i].isExplicit,
              streams: this.tracks[i].streams,
              title: this.tracks[i].title,
              albumId: this.tracks[i].albumId
            });
          }
          console.log(this.tracksDto);
          this.dataSource.data = this.tracksDto;
        }
      })
    }
  }

  ngOnInit(): void {
    this.dataSource.sortingDataAccessor = (item, prop) => {
      switch (prop)
      {
        case 'position': return item.position;
      }
      return '';
    }
    this.dataSource.sort = this.sort;
    this.reloadData();

    this.musicPlayerService.shuffleToggled.subscribe({
      next: data => {
        this.isShuffled = data;
      }
    })
  }

  getPosition(id:number) {
    return (this.tracksDto.find(x => x.id === id))?.position.toString();
  }

  getArtists(id:number) {
    let track = this.tracksDto.find(x => x.id === id)!;
    let artists = "";
    for (let i = 0; i < track.artists.length; i++) {
      artists += i == 0 ? track.artists[i].name : ', ' + track.artists[i].name;
    }
    return artists;
  }

  getDuration(id:number) {
    let track = this.tracksDto.find(x => x.id === id)!;
    let minutes = Math.floor(track.length / 60).toString();
    let seconds = (track.length % 60).toFixed(0);

    if(Number(seconds) < 10){
      seconds = '0' + seconds;
    }
    return `${minutes}:${seconds}`;
  }

  goToArtistProfile(artist: ArtistSimpleDto | ArtistTrackDto) {
    //TODO: Implement when user side profiles are made
    console.log(artist);
  }

  displayControls(b: boolean) {
    this.shouldDisplayControls = b;
    console.log(this.shouldDisplayControls);
  }

  emitTrack(id: number) {
    /*
    this.getTrackService.handleAsync(id).subscribe({
      next: data => {
        this.onMainClick.emit(data);
      }
    })
    */
    this.onMainClick.emit(id);
  }

  deleteTrack(id: number) {
    let matRef = this.matDialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      data: {
        title: "Are you sure you want to delete this track",
        content: "This will permanently remove this track from your catalogue!"
      }
    })

    matRef.afterClosed().subscribe({
      next: data => {
        if(data)
        {
          this.deleteTrackService.handleAsync(id).subscribe({
            next: data => {
              this.snackBar.open(data, "Dismiss", {duration: 3500});
              this.reloadData();
            }
          })
        }
      }
    })
  }

  setPageOpitions(page: PageEvent) {
    this.pagedRequest.pageNumber = page.pageIndex+1;
    this.pagedRequest.pageSize = page.pageSize;
    this.reloadData();
  }

  searchTracks(queryString: string) {
    this.pagedRequest.title = queryString;
    this.reloadData();
  }

  emitCreate() {
    this.onCreateClick.emit();
  }

  openShareSheet() {
    let matRef = this.btmSheet.open(ShareBottomSheetComponent, {hasBackdrop: true, data: {
      url: MyConfig.ui_address + "/listener/release/"+this.tracks[0].albumId,
      }});

  }

  toggleShuffle() {
    this.musicPlayerService.toggleShuffle();
  }
}
