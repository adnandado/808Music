import {Component, Input} from '@angular/core';
import {MyConfig} from '../../../my-config';
import {MyPagedList} from '../../../services/auth-services/dto/my-paged-list';
import {AlbumGetAllResponse} from '../../../endpoints/album-endpoints/album-get-all-endpoint.service';
import {Params, Router} from '@angular/router';
import {TrackGetAllEndpointService} from '../../../endpoints/track-endpoints/track-get-all-endpoint.service';
import {MusicPlayerService} from '../../../services/music-player.service';

@Component({
  selector: 'app-album-card-list',
  templateUrl: './album-card-list.component.html',
  styleUrls: ['../../listener/artist-page/artist-music-page/artist-music-page.component.css','./album-card-list.component.css']
})
export class AlbumCardListComponent {
  protected readonly MyConfig = MyConfig;
  @Input() albums: MyPagedList<AlbumGetAllResponse> | null = null;
  @Input() title: string = "RELEASES";
  @Input() queryParams: Params | null = null;

  constructor(private router: Router,
              private trackGetAllService: TrackGetAllEndpointService,
              private musicPlayerService: MusicPlayerService,) {
  }

  goToAlbum(id: number) {
    this.router.navigate(["listener/release", id])
  }

  getTitle(title: string | undefined) {
    if(title == undefined)
    {
      return "";
    }
    let i = title.indexOf(" ");
    if(i <= -1 && title.length > 20 || i > 20 )
    {
      return title.substring(0, 17) + "...";
    }
    return title;
  }

  playAlbum(id: number, featured: boolean = false) {
    let a = this.albums?.dataItems.find(item => item.id == id)
    if(a)
    {
      this.trackGetAllService.handleAsync({albumId: id}).subscribe({
        next: value => {
          this.musicPlayerService.createQueue(value.dataItems,{display:a?.title + " - " + a?.type, value:"/listener/release/"+id});
        }
      })
    }
  }

  getYear(releaseDate: string) {
    return new Date(releaseDate).getFullYear();
  }

  viewAll(featured: boolean) {
    this.router.navigate(["listener/releases"],{queryParams: this.queryParams});
  }
}
