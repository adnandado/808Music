import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MyUserAuthService} from '../../../services/auth-services/my-user-auth.service';
import {ArtistHandlerService} from '../../../services/artist-handler.service';

@Component({
  selector: 'app-artist-layout',
  templateUrl: './artist-layout.component.html',
  styleUrl: './artist-layout.component.css'
})
export class ArtistLayoutComponent implements OnInit {
  selectedArtist = false;


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
}
