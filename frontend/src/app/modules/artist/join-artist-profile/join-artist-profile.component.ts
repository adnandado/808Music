import {Component, inject, OnInit} from '@angular/core';
import {
  UserInviteAcceptEndpointService
} from '../../../endpoints/user-artist-invite-endpoints/user-invite-accept-endpoint.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-join-artist-profile',
  templateUrl: './join-artist-profile.component.html',
  styleUrl: './join-artist-profile.component.css'
})
export class JoinArtistProfileComponent implements OnInit {
  constructor(private userInviteService : UserInviteAcceptEndpointService,
              private router : Router,
              private route : ActivatedRoute,) {
  }
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    console.log("hello")
    let code = "";
    this.route.queryParams.subscribe(params => {
      code = params['code'] ?? "";
      if(code != "")
      {
        this.userInviteService.handleAsync({inviteToken:code}).subscribe({
          next: data => {
            this.snackBar.open(data, "Dismiss", {duration: 3500});

            setTimeout(() =>{
              this.router.navigate(['/artist/album']);
            }, 2000)
          }
        })
      }
    })
  }

}
