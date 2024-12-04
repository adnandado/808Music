import {Component, OnInit} from '@angular/core';
import {
  ArtistGetAllByUserEndpointService
} from '../../../endpoints/user-artist-endpoints/artist-get-all-by-user-endpoint.service';
import {ArtistSimpleDto} from '../../../services/auth-services/dto/artist-dto';
import {HttpErrorResponse} from '@angular/common/http';
import {ArtistHandlerService} from '../../../services/artist-handler.service';
import {MyConfig} from '../../../my-config';
import {MyUserAuthService} from '../../../services/auth-services/my-user-auth.service';

@Component({
  selector: 'app-choose-profile',
  templateUrl: './choose-profile.component.html',
  styleUrl: './choose-profile.component.css'
})
export class ChooseProfileComponent implements OnInit {
  artists: ArtistSimpleDto[] | null = null;
  readonly url = MyConfig.api_address;
  selectedArtist = false;

  constructor(private artistGetAll : ArtistGetAllByUserEndpointService,
              private artistHandler: ArtistHandlerService,
              private auth: MyUserAuthService,) {
  }

  ngOnInit(): void {

        if(this.artistHandler.isArtistSelected())
        {
          this.selectedArtist = true;
        }

        this.artistGetAll.handleAsync().subscribe({
          next: data => {
            this.artists = data;
          },
          error: (err:HttpErrorResponse) => {
            alert(err);
          }
        })
    }

  SelectProfile(artist: ArtistSimpleDto) {
    this.artistHandler.setSelectedArtist(artist);
    this.selectedArtist = this.artistHandler.isArtistSelected();
  }
}
