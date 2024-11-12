import {Component, OnInit} from '@angular/core';
import {
  AlbumGetAllEndpointService,
  AlbumGetAllResponse
} from '../../../../endpoints/album-endpoints/album-get-all-endpoint.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrl: './album-list.component.css'
})
export class AlbumListComponent implements OnInit {
  albums: AlbumGetAllResponse[] | null = null;
  readonly displayColumns= ["Id","Title","ReleaseDate", "Artist"]

  constructor(private albumService: AlbumGetAllEndpointService) {
  }

  ngOnInit(): void {
    this.albumService.handleAsync({}).subscribe(
      a =>{
        this.albums = a
        console.log(JSON.stringify(a[0]))
      }
    )
  }
}
