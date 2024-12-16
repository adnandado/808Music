import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {
  ArtistTrackDto,
  TrackGetByIdEndpointService,
  TrackGetResponse
} from '../../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {Location} from '@angular/common';
import {
  TrackInsertOrUpdateEndpointService,
  TrackInsertRequest
} from '../../../../endpoints/track-endpoints/track-insert-or-update-endpoint.service';
import {ArtistHandlerService} from '../../../../services/artist-handler.service';
import {ArtistSimpleDto} from '../../../../services/auth-services/dto/artist-dto';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-tracks-create-or-edit',
  templateUrl: './tracks-create-or-edit.component.html',
  styleUrls: ['./tracks-create-or-edit.component.css']
})
export class TracksCreateOrEditComponent implements OnInit {
  trackForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    isExplicit: new FormControl(false),
    trackFile: new FormControl(),
    artistIds: new FormControl<number[]>([])
  });
  oldTrack: TrackGetResponse | null = null;
  albumId: number = -1;
  newTrack: TrackInsertRequest | null = null;
  trackId : number | null = null;

  selectedArtists : ArtistTrackDto[]= [];

  @Output() onUpdate: EventEmitter<any> = new EventEmitter();
  snackBar: MatSnackBar = inject(MatSnackBar);
  location: Location = inject(Location);

  protected readonly Validators = Validators;

  constructor(private getTrackService: TrackGetByIdEndpointService,
              private route: ActivatedRoute,
              private artistHandler: ArtistHandlerService,
              private router: Router,
              private postTrackService: TrackInsertOrUpdateEndpointService) {
  }

  ngOnInit(): void {
    this.reloadData();

    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.route.params.subscribe(params => {
          let newId = params['id'];
          if(newId !== undefined && newId !== null)
          {
            if(newId != this.trackId)
            {
              this.reloadData();
              console.log(newId)
            }
          }
        })
      }
    })
  }

  emitCancel() {
    this.router.navigate(['/artist/tracks', this.albumId]);
  }

  createTrack() {
    this.newTrack = {
      title: this.trackForm.get('title')!.value,
      id: this.trackId ?? undefined,
      trackFile: this.trackForm.get('trackFile')!.value,
      albumId: this.albumId,
      isExplicit: this.trackForm.get('isExplicit')!.value,
      artistIds: this.trackForm.get('artistIds')!.value
    }
    this.postTrackService.handleAsync(this.newTrack).subscribe({
      next: data => {
        this.snackBar.open(`Successfully created track!`, "Dismiss", {duration: 3000});
        this.router.navigate(['/artist/tracks', this.albumId]);
      }
    })
    console.log(this.newTrack);
  }

  setTrackFile(trackFile: File | undefined) {
    (this.trackForm.get('trackFile') as FormControl).setValue(trackFile);
    console.log((this.trackForm.get('trackFile') as FormControl).value);
  }

  reloadData() {
    let artist = this.artistHandler.getSelectedArtist();
    (this.trackForm.get('artistIds') as FormControl<number[]>).setValue([]);
    this.route.queryParams.subscribe(params => {
      this.albumId = params['albumId'];
    })

    this.route.params.subscribe(params => {
      let id : number = params['id'];
      if(id !== undefined && id !== null){
        this.trackId = id;

        this.getTrackService.handleAsync(id).subscribe({
          next: value => {
            this.oldTrack = value;
            if(this.oldTrack != null)
            {
              this.selectedArtists = this.oldTrack.artists.filter(x => x.id !== artist?.id);
              (this.trackForm.get('isExplicit') as FormControl<boolean>).setValue(this.oldTrack.isExplicit);
              (this.trackForm.get('artistIds') as FormControl<number[]>).setValue(this.selectedArtists.map(x => x.id));
            }
            console.log((this.trackForm.get('artistIds') as FormArray));
          }
        })

      }
    })

    this.newTrack = {
      title: "",
      isExplicit: false,
      artistIds: [artist!.id],
      albumId: this.albumId
    }
  }

  getArtists() {
    let selectedArtists : ArtistSimpleDto[] = [];
    this.oldTrack?.artists.forEach(artist => {
      selectedArtists.push({
        id:artist.id,
        pfpPath: artist.pfpPath,
        name: artist.name,
        role: "",
        deletionDate: "",
        isFlaggedForDeletion: false
      })
    })
    console.log(selectedArtists)
    return selectedArtists;
  }

  removeArtist(artist: ArtistTrackDto) {
    let indexOT = this.selectedArtists.indexOf(artist);
    if(indexOT != -1)
    {
      this.selectedArtists = this.selectedArtists.filter(x => x.id !== artist.id);
    }
    let indexNT = (this.trackForm.get('artistIds') as FormControl<number[]>).value.indexOf(artist.id);
    if(indexNT != -1)
    {
      let arr = (this.trackForm.get('artistIds') as FormControl<number[]>).value;
      (this.trackForm.get('artistIds') as FormControl<number[]>).setValue(arr.filter(id => id !== artist.id));
    }
  }

  addArtist(artistDto: ArtistSimpleDto) {
    let artist = {...artistDto, isLead: false}
    let index = this.selectedArtists.find(a => a.id == artist.id)?.id
    if(index == undefined)
    {
      this.selectedArtists.push(artist);
      (this.trackForm.get('artistIds') as FormControl<number[]>).value.push(artist.id);
    }
    else {
      this.snackBar.open("Error: This artist is already featured", "Dismiss", {duration: 2000});
    }
  }
}
