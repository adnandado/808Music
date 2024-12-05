import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MyUserAuthService} from '../../../services/auth-services/my-user-auth.service';
import {ArtistHandlerService} from '../../../services/artist-handler.service';
import {ArtistDetailResponse} from '../../../endpoints/artist-endpoints/artist-get-by-id-endpoint.service';
import {ArtistInsertRequest} from '../../../endpoints/artist-endpoints/artist-insert-or-update-endpoint.service';

@Component({
  selector: 'app-artist-layout',
  templateUrl: './artist-layout.component.html',
  styleUrl: './artist-layout.component.css'
})
export class ArtistLayoutComponent implements OnInit {
  selectedArtist = false;
  isEditingId: ArtistInsertRequest | null = null;
  isCreating : boolean | null  = false;
  shouldRefresh: boolean = false;

  constructor(private router: Router,
              private auth: MyUserAuthService,
              private artistHandler: ArtistHandlerService) { }

  ngOnInit(): void {
        if(!this.auth.isLoggedIn())
        {
          this.router.navigate(['/auth/login']);
        }
        this.selectedArtist = this.artistHandler.isArtistSelected();
    }

  SetSelectedArtist(e: boolean) {
    this.selectedArtist = e;
  }

  SetEditState(id: ArtistDetailResponse | null = null)
  {
    if(id)
    {
      this.isCreating = false;
    }
    this.isEditingId = id;
  }

  setCreateState(creating: boolean | null) {
    if(creating)
    {
      this.isEditingId = null;
    }
    this.isCreating = creating;
  }

  refreshProfiles(e: boolean) {
    this.shouldRefresh = e;
  }
}
