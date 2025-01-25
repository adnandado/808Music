import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MyConfig} from '../../../../my-config';
import {UserFollowService} from '../../../../endpoints/user-endpoints/get-user-followage-endpoint.service';
import { Location } from '@angular/common';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-following-page',
  templateUrl: './following-page.component.html',
  styleUrls: ['./following-page.component.css'],
  animations: [
    trigger('pageAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.4s ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.5s ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('profileImageAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('0.3s ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class FollowingPageComponent implements OnInit {
  following: any[] = [];
  userId: number = 0;
  readonly mediaAddress = MyConfig.media_address;

  constructor(
    private route: ActivatedRoute,
    private userFollowService: UserFollowService,
    private location : Location,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.params['id']);
    this.loadFollowing();
  }

  loadFollowing(): void {
    this.userFollowService.getFollowingAndFollowers(this.userId).subscribe({
      next: (response) => {
        this.following = response.following;
      },
      error: (err) => {
        console.error('Error fetching following:', err);
      },
    });
  }


  openProfile(userId: number): void {
    this.router.navigate(['listener/user/', userId]);
  }

  openArtistProfile(artistId: any) {
    this.router.navigate(['listener/profile/', artistId]);

  }

  goBack() {
    this.location.back();
  }
}
