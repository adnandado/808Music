import {Component, OnInit} from '@angular/core';
import {
  AlbumInsertOrUpdateEndpointService, AlbumInsertRequest, AlbumInsertResponse
} from '../../../../endpoints/album-endpoints/album-insert-or-update-endpoint.service';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../../../my-config';
import {ActivatedRoute, Router} from '@angular/router';
import {AlbumGetByIdEndpointService} from '../../../../endpoints/album-endpoints/album-get-by-id-endpoint.service';
import {
  AlbumType,
  AlbumTypeGetAllEndpointService
} from '../../../../endpoints/album-endpoints/album-type-get-all-endpoint.service';

@Component({
  selector: 'app-album-create',
  templateUrl: './album-create.component.html',
  styleUrl: './album-create.component.css'
})
export class AlbumCreateComponent implements OnInit {
  //temp
  artists: {id: number, name: string}[] | null = null;

  albumData: AlbumInsertRequest = {
    albumTypeId: 1,
    isActive: false,
    artistId: 1,
    distributor: "",
    releaseDate: "",
    title:""
  };

  existingCoverPath : string = "";
  albumTypes: AlbumType[] | null = null;

  constructor(private albumCreate: AlbumInsertOrUpdateEndpointService,
              private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private albumGet: AlbumGetByIdEndpointService,
              private albumTypeGet: AlbumTypeGetAllEndpointService) {
  }

  //temp
  ngOnInit(): void {
    this.http.get<{id: number, name: string}[]>(`${MyConfig.api_address}/api/GetArtistsEndpoint`).subscribe(
      a => { this.artists = a; }
    )
    let id: number = this.route.snapshot.params['id'];
    if(id != null)
    {
      console.log(id);
      this.albumGet.handleAsync(id).subscribe(a => {
        this.albumData.id = a.id;
        this.albumData.distributor = a.distributor;
        this.albumData.releaseDate = a.releaseDate;
        this.albumData.title = a.title;
        this.albumData.albumTypeId = a.type.id;
        this.albumData.artistId = a.artist.id;
        this.albumData.isActive = a.isActive;

        this.existingCoverPath = a.coverPath
      })
    }

    this.albumTypeGet.handleAsync(null).subscribe(t => {
         this.albumTypes = t;
    });
  }

  createAlbum() {
    let response: AlbumInsertResponse | null = null;
    this.albumCreate.handleAsync(this.albumData).subscribe(res => {
      response = res;
      alert("Album created successfully.\n"+JSON.stringify(response)+"\n");
      this.backToList();
    });
  }

  onImagePicked($event: Event) {
    const file = ($event.target as HTMLInputElement).files![0];
    if(file != null)
    {
      this.albumData.coverImage = file;
    }
    this.logData()
  }

  backToList():void {
    this.router.navigate(['/artist/album']);
  }

  logData() {
    console.log(this.albumData);
  }

  protected readonly MyConfig = MyConfig;
}
