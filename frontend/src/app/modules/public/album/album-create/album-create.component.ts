import { Component } from '@angular/core';
import {
  AlbumInsertOrUpdateEndpointService, AlbumInsertRequest, AlbumInsertResponse
} from '../../../../endpoints/album-endpoints/album-insert-or-update-endpoint.service';

@Component({
  selector: 'app-album-create',
  templateUrl: './album-create.component.html',
  styleUrl: './album-create.component.css'
})
export class AlbumCreateComponent {
  albumData: AlbumInsertRequest = {
    albumTypeId: 1,
    isActive: 0,
    artistId: 1,
    distributor: "",
    releaseDate: "",
    title:""
  };

  constructor(private albumCreate: AlbumInsertOrUpdateEndpointService) {
  }

  createAlbum() {
    let response: AlbumInsertResponse | null = null;
    this.albumCreate.handleAsync(this.albumData).subscribe(res => {
      response = res;
    });
    alert("Album created successfully.\n"+JSON.stringify(response)+"\n");
  }

  LogData(){
    console.log(JSON.stringify(this.albumData));
    console.log(typeof(this.albumData.coverImage));
  }

  onImagePicked($event: Event) {
    const file = ($event.target as HTMLInputElement).files![0];
    if(file != null)
    {
      this.albumData.coverImage = file;
    }
  }
}
