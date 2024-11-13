import {Component, OnInit} from '@angular/core';
import {
  AlbumGetAllEndpointService,
  AlbumGetAllResponse
} from '../../../../endpoints/album-endpoints/album-get-all-endpoint.service';
import {AlbumDeleteEndpointService} from '../../../../endpoints/album-endpoints/album-delete-endpoint.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrl: './album-list.component.css'
})
export class AlbumListComponent implements OnInit {
  albums: AlbumGetAllResponse[] | null = null;
  readonly displayColumns= ["Id","Title","ReleaseDate", "Artist"]

  constructor(private albumService: AlbumGetAllEndpointService,
              private albumDeleteService: AlbumDeleteEndpointService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.albumService.handleAsync({}).subscribe(
      a =>{
        this.albums = a
        console.log(JSON.stringify(a[0]))
      }
    )
  }

  deleteAlbum(id: number) {
    if(confirm("Are you sure you want to delete this album?"))
    {
      this.albumDeleteService.handleAsync(id).subscribe({
        error: () => { alert("Album deletion failed."); },
        complete: () => {
          alert("Album deleted successfully.");
          this.ngOnInit();
        }
      });
    }
  }

  editAlbum(id: number) {
    this.router.navigate(['/artist/edit', id]);
  }
}
