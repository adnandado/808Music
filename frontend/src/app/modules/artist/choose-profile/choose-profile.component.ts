import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {
  ArtistGetAllByUserEndpointService
} from '../../../endpoints/user-artist-endpoints/artist-get-all-by-user-endpoint.service';
import {ArtistSimpleDto} from '../../../services/auth-services/dto/artist-dto';
import {HttpErrorResponse} from '@angular/common/http';
import {ArtistHandlerService} from '../../../services/artist-handler.service';
import {MyConfig} from '../../../my-config';
import {MyUserAuthService} from '../../../services/auth-services/my-user-auth.service';
import {
  ArtistDetailResponse,
  ArtistGetByIdEndpointService
} from '../../../endpoints/artist-endpoints/artist-get-by-id-endpoint.service';
import {
  UserLeaveArtistEndpointService
} from '../../../endpoints/user-artist-endpoints/user-leave-artist-endpoint.service';

@Component({
  selector: 'app-choose-profile',
  templateUrl: './choose-profile.component.html',
  styleUrl: './choose-profile.component.css'
})
export class ChooseProfileComponent implements OnInit, OnChanges {
  artists: ArtistSimpleDto[] | null = null;
  readonly url = MyConfig.api_address;

  @Input() refresh: boolean = false;

  @Output() selected: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() editEvent = new EventEmitter<ArtistDetailResponse>();
  @Output() createEvent = new EventEmitter<boolean>();

  constructor(private artistGetAll: ArtistGetAllByUserEndpointService,
              private artistHandler: ArtistHandlerService,
              private auth: MyUserAuthService,
              private artistById: ArtistGetByIdEndpointService,
              private leaveArtist: UserLeaveArtistEndpointService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
        if(this.refresh)
        {
          this.ngOnInit();
          this.refresh = false;
        }
  }

  ngOnInit(): void {
        this.selected.emit(this.artistHandler.isArtistSelected());
        this.artistGetAll.handleAsync().subscribe({
          next: data => {
            this.artists = data;
          },
          error: (err:HttpErrorResponse) => {
            alert(err);
          }
        })
    }

  SelectProfile(artist: ArtistSimpleDto | null = null) {
    if(artist == null)
    {

    }
    else {
      this.artistHandler.setSelectedArtist(artist);
      this.selected.emit(this.artistHandler.isArtistSelected());
    }
  }

  EmitEdit(id: number) {
    let artist = this.artistById.handleAsync(id).subscribe({
      next: data => {
        this.editEvent.emit(data);
      },
      error: (err: HttpErrorResponse) => {
        alert(err.error);
      }
    })
  }

  emitCreate() {
    this.createEvent.emit(true);
  }

  leaveProfile(id: number) {
    if(confirm("Are you sure you want to leave this artist profile?")) {
      this.leaveArtist.handleAsync(id).subscribe({
        next: data => {
          alert(data);
          this.ngOnInit();
        },
        error: (err: HttpErrorResponse) => {
          alert(err.error)
        }
      })
    }
  }
}
