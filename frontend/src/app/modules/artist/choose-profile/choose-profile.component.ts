import {Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
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
import {
  ArtistGetAllByUserEndpointService
} from '../../../endpoints/artist-endpoints/artist-get-all-by-user-endpoint.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfirmDialogComponent} from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-choose-profile',
  templateUrl: './choose-profile.component.html',
  styleUrl: './choose-profile.component.css'
})
export class ChooseProfileComponent implements OnInit, OnChanges {
  artists: ArtistSimpleDto[] | null = null;
  readonly url = MyConfig.api_address;

  readonly matDialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);

  @Input() refresh: boolean = false;

  @Output() selected: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() editEvent = new EventEmitter<ArtistDetailResponse>();
  @Output() createEvent = new EventEmitter<boolean>();
  @Output() manageEvent = new EventEmitter<ArtistDetailResponse>();

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
    let matDialogRef = this.matDialog.open(ConfirmDialogComponent, {data:
        {
          title: "Leave this profile",
          content: "You will lose access to this profile until the owner invites you again."
        },
      hasBackdrop: true});
    matDialogRef.afterClosed().subscribe({
      next: data => {
        if(data)
        {
          this.leaveArtist.handleAsync(id).subscribe({
            next: data => {
              this.snackBar.open(data, "Dismiss", {duration: 3500});
              this.ngOnInit();
            },
            error: (err: HttpErrorResponse) => {
              this.snackBar.open(err.error, "Dismiss", {duration: 3500});
            }
          })
        }
      }})
  }

  EmitManage(id: number) {
    let artist = this.artistById.handleAsync(id).subscribe({
      next: data => {
        this.manageEvent.emit(data);
      },
      error: (err: HttpErrorResponse) => {
        alert(err.error);
      }
    })
  }
}
