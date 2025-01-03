import {Component, Input} from '@angular/core';
import {MyConfig} from '../../../../my-config';
import {ArtistSimpleDto} from '../../../../services/auth-services/dto/artist-dto';
import {Params, Router} from '@angular/router';

@Component({
  selector: 'app-artist-big-card-list',
  templateUrl: './artist-big-card-list.component.html',
  styleUrls: ['../../../listener/artist-page/artist-music-page/artist-music-page.component.css','./artist-big-card-list.component.css']
})
export class ArtistBigCardListComponent {

  protected readonly MyConfig = MyConfig;
  @Input() title: string = "Artists";
  @Input() artists: ArtistSimpleDto[] | null  = null;
  @Input() numberDescription = "number"
  @Input() queryParams: Params | null = null;

  constructor(private router: Router) {
  }

  viewAll(b: boolean) {
    this.router.navigate(["/listener/artists"], {queryParams: this.queryParams});
  }
}
