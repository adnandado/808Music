import {Component, HostListener, inject, OnInit} from '@angular/core';
import {
  AlbumGetAllEndpointService,
  AlbumGetAllResponse, AlbumPagedRequest
} from '../../../../endpoints/album-endpoints/album-get-all-endpoint.service';
import {AlbumDeleteEndpointService} from '../../../../endpoints/album-endpoints/album-delete-endpoint.service';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {MyUserAuthService} from '../../../../services/auth-services/my-user-auth.service';
import {ArtistHandlerService} from '../../../../services/artist-handler.service';
import {MyPagedList} from '../../../../services/auth-services/dto/my-paged-list';
import {MyConfig} from "../../../../my-config";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmDialogComponent} from "../../../shared/dialogs/confirm-dialog/confirm-dialog.component";
import {PageEvent} from "@angular/material/paginator";
import {
  AlbumType,
  AlbumTypeGetAllEndpointService
} from "../../../../endpoints/album-endpoints/album-type-get-all-endpoint.service";
import {MatChipSelectionChange} from "@angular/material/chips";
import {HttpErrorResponse} from "@angular/common/http";
import {MatCheckboxChange} from "@angular/material/checkbox";

@Component({
  selector: 'app-album-list-material',
  templateUrl: './album-list-material.component.html',
  styleUrls: ['../../choose-profile/choose-profile.component.css','../../artist-layout/artist-layout.component.css','./album-list-material.component.css']
})
export class AlbumListMaterialComponent implements OnInit {
  selectedAlbum: boolean = true;
  pagedList : MyPagedList<AlbumGetAllResponse> | null = null;
  albums: AlbumGetAllResponse[] | null = null;
  albumTypes : AlbumType[] | null = null;
  filteredAlbumTypes : AlbumType[] = [];
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);
  pagedRequest : AlbumPagedRequest = {
    title: ""
  }
  defaultPageSize = 20;

  isHome = false;

  constructor(private albumService: AlbumGetAllEndpointService,
              private albumDeleteService: AlbumDeleteEndpointService,
              private router: Router,
              private auth: MyUserAuthService,
              private artistHandler: ArtistHandlerService,
              private albumTypeGet : AlbumTypeGetAllEndpointService,
              private route : ActivatedRoute)
  {
  }

  ngOnInit(): void {
    this.checkIfHome();
    this.pagedRequest.artistId = this.artistHandler.getSelectedArtist()?.id;
    this.pagedRequest.pageNumber = 1;
    this.pagedRequest.pageSize = this.defaultPageSize;

    this.albumService.handleAsync(this.pagedRequest).subscribe(
      a => {
        this.pagedList = a;
        this.albums = a.dataItems
        console.log(JSON.stringify(a.dataItems[0]))
      }
    )

    this.albumTypeGet.handleAsync(null).subscribe(t => {
      this.albumTypes = t;
    });

  }

  deleteAlbum(id: number) {
    let album = this.albums?.find(x => x.id === id);

    let matRef = this.dialog.open(ConfirmDialogComponent, {hasBackdrop: true,
    data:{
      title: "Are you sure you want to delete " + album?.title,
      content: "This will delete every track that is in the album.",
    }})

    matRef.afterClosed().subscribe(res => {
      if(res)
      {
        this.albumDeleteService.handleAsync(id).subscribe({
          error: () => { alert("Album deletion failed."); },
          complete: () => {
            this.snackBar.open(album?.title + " deleted successfully.", "Dismiss", {
              duration: 3000
            });
            this.ngOnInit();
          }
        });
      }
    })
  }

  editAlbum(id: number) {
    this.router.navigate(['artist/album/edit', id]);
  }

  getDateString(date: string) :string {
    return new Date(date).toLocaleDateString('en-GB', {weekday:"long", month:"numeric", day:"numeric", year:"numeric"});
  }

  protected readonly MyConfig = MyConfig;

  getReleaseYear(releaseDate: string) {
    return new Date(releaseDate).getFullYear().toString();
  }

  showStats(id: number) {

  }

  switchPage(e: PageEvent) {
    this.pagedRequest.pageNumber = e.pageIndex+1;
    this.pagedRequest.pageSize = e.pageSize;

    this.albumService.handleAsync(this.pagedRequest).subscribe({
      next: data => {
        this.pagedList = data;
        this.albums = data.dataItems;
      }
    })
  }

  openCreate(s: string) {
    this.router.navigate([s]);
  }

  filterSelectedType(e: MatChipSelectionChange) {
    if(e.source.id === "0")
    {
      e.source.select();
      this.pagedRequest.typeId = undefined;
    }
    else if(e.selected)
    {
      this.pagedRequest.typeId = (e.source.value as AlbumType).id;
    }
    else {
      this.pagedRequest.typeId = undefined;
    }
    this.reloadData();
  }

  filterReleaseStatus(e: MatChipSelectionChange) {
    if(e.source.id === "0")
    {
      e.source.select();
      this.pagedRequest.isReleased = undefined;
    }
    else if(e.selected)
    {
      this.pagedRequest.isReleased = e.source.value as boolean;
    }
    else {
      this.pagedRequest.isReleased = undefined;
    }
    this.reloadData();
  }

  reloadData() {
    this.albumService.handleAsync(this.pagedRequest).subscribe({
      next: data => {
        this.pagedList = data;
        this.albums = data.dataItems;
      },
      error: (err:HttpErrorResponse) => {
        this.snackBar.open(err.error, "Dismiss", {
          duration: 2500
        })
      }
    })
  }

  fitlerSearch() {
    this.reloadData();
  }

  checkIfHome() {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart)
      {
        if(event.url == "/artist/album")
        {
          this.reloadData();
          this.isHome = true;
          console.log(event.url);
        }
        else {
          this.isHome = false;
        }
      }
    })
  }
}
