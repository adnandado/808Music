import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {ArtistSimpleDto} from '../../../../services/auth-services/dto/artist-dto';
import {
  ArtistGetAutocompleteEndpointService, UserArtistSearchRequest
} from '../../../../endpoints/artist-endpoints/artist-get-autocomplete-endpoint.service';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {TrackGetByIdEndpointService} from '../../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';
import {tap} from 'rxjs/operators';

export interface MyMatAutocompleteOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-my-mat-artist-autocomplete',
  templateUrl: './my-mat-artist-autocomplete.component.html',
  styleUrl: './my-mat-artist-autocomplete.component.css',
})

export class MyMatArtistAutocompleteComponent implements OnInit {
  options: ArtistSimpleDto[] = [];
  @Input() trackId: number = -1;
  sameTrackId : number = -1;
  @Output() onSelected = new EventEmitter<ArtistSimpleDto>();
  @Output() onRemove = new EventEmitter<number>();
  //@Output() onChange = new EventEmitter<string>();
  selectedArtists: ArtistSimpleDto[] = [];
  @Input() startingArtists: ArtistSimpleDto[] = [];
  errorMessage: string = "";

  constructor(private artistGetAutoComplete: ArtistGetAutocompleteEndpointService,
              private router: Router,
              private getTrackService : TrackGetByIdEndpointService) {
  }


  ngOnInit(): void {
    this.fetchOptions("");
    /*
    if(this.trackId != -1)
    {
      this.getTrackService.handleAsync(this.trackId).pipe(tap(response => {
        this.selectedArtists = [];
        response.artists.forEach(artist => {
          this.selectedArtists.push({
            id: artist.id,
            pfpPath: artist.profilePhotoPath,
            name: artist.name,
            role:"",
            deletionDate:"",
            isFlaggedForDeletion:false
          })
        })
      })).subscribe({
        next: data => {
          console.log(data);
        }
      })

    }


    this.router.events.subscribe({
      next: data => {
        if(data instanceof NavigationStart)
        {
          this.ngOnInit();
        }
      }
    })
     */
  }

  display(option: ArtistSimpleDto) {
    return option.name;
  }

  updateOptions(e: Event) {
    this.fetchOptions((e.target as HTMLInputElement).value as string);
    //this.onChange.emit((e.target as HTMLInputElement).value as string);
  }

  private fetchOptions(value: string) {
    let req : UserArtistSearchRequest = {
      searchString: value,
      leadTrackId: this.trackId != -1 ? this.trackId : undefined,
    }
    this.artistGetAutoComplete.handleAsync(req).subscribe({
      next: e => {
        this.options = e;
      }
    });
  }

  emitSelection(option: MatAutocompleteSelectedEvent) {
    let artist = option.option.value as ArtistSimpleDto;
    //let index = this.selectedArtists.indexOf(artist);
    //if(index == -1) {
      //this.selectedArtists.push(artist);
    //}
    this.onSelected.emit(artist);
  }

  removeArtist(artist: ArtistSimpleDto, index: number) {
    //let index2 = this.startingArtists.indexOf(artist);
    //this.startingArtists.splice(index2, 1);
    //this.selectedArtists.splice(index, 1);
    this.onRemove.emit(artist.id);
  }
}
