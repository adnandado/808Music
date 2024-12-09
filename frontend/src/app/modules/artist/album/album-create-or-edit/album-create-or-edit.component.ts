import {Component, inject, Input, OnInit} from '@angular/core';
import {
  AlbumInsertOrUpdateEndpointService,
  AlbumInsertRequest, AlbumInsertResponse
} from '../../../../endpoints/album-endpoints/album-insert-or-update-endpoint.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MyUserAuthService} from '../../../../services/auth-services/my-user-auth.service';
import {AlbumGetByIdEndpointService} from '../../../../endpoints/album-endpoints/album-get-by-id-endpoint.service';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MyConfig} from '../../../../my-config';
import {
  AlbumType,
  AlbumTypeGetAllEndpointService
} from '../../../../endpoints/album-endpoints/album-type-get-all-endpoint.service';

@Component({
  selector: 'app-album-create-or-edit',
  templateUrl: './album-create-or-edit.component.html',
  styleUrls: ['../../artist-create-or-edit/artist-create-or-edit.component.css', './album-create-or-edit.component.css']
})
export class AlbumCreateOrEditComponent implements OnInit{
  @Input() album: AlbumInsertRequest = {
    title: "",
    releaseDate: "",
    distributor: "",
    albumTypeId: 0,
    artistId: 0,
    isActive: true,
  }
  existingCoverPath : string = "";
  albumTypes: AlbumType[] | null = null;
  snackBar = inject(MatSnackBar);

  constructor(private router: Router,
              private route: ActivatedRoute,
              private albumGet: AlbumGetByIdEndpointService,
              private albumTypeGet: AlbumTypeGetAllEndpointService,
              private albumCreate: AlbumInsertOrUpdateEndpointService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadAlbum(params["id"]);
    })
    this.albumTypeGet.handleAsync(null).subscribe(t => {
      this.albumTypes = t;
    });
  }

  loadAlbum(id:number) {
    if(id != undefined){
      this.albumGet.handleAsync(id).subscribe({
        next: value => {
          this.album.id = value.id;
          this.album.distributor = value.distributor;
          this.album.releaseDate = value.releaseDate;
          this.album.title = value.title;
          this.album.albumTypeId = value.type.id;
          this.album.artistId = value.artist.id;
          this.album.isActive = value.isActive;

          this.existingCoverPath = value.coverPath
        },
        error: (err: HttpErrorResponse) => {
          this.snackBar.open(err.error, "Dismiss", {duration: 2000});
        }
      })
    }
  }


  createAlbum() {
    this.albumCreate.handleAsync(this.album).subscribe({
      next: value => {
        this.album.id != undefined ?
          this.snackBar.open("Successfully created " + value.title + "!", "Dismiss", {duration: 3000}) :
          this.snackBar.open("Successfully updated " + value.title + "!", "Dismiss", {duration: 3000});
          this.router.navigate(['/artist/album']);
      }
    });
  }

  selectCoverFile(e: File | undefined) {
    this.album.coverImage = e;
  }

  protected readonly MyConfig = MyConfig;

  getPath() {
    return MyConfig.api_address+this.existingCoverPath;
  }

  logData() {
    this.snackBar.open(this.album.albumTypeId.toString(), "Dismiss", {duration: 2000});
  }

  isAlreadyReleased() :boolean{
    return new Date(this.album.releaseDate).getTime() < Date.now();
  }
}
