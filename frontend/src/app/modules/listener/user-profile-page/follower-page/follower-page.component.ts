import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MyConfig} from '../../../../my-config';
import {UserFollowService} from '../../../../endpoints/user-endpoints/get-user-followage-endpoint.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-followers-page',
  templateUrl: './follower-page.component.html',
  styleUrls: ['./follower-page.component.css'],
})
export class FollowersPageComponent implements OnInit {
  followers: any[] = [];
  userId: number = 0;
  readonly mediaAddress = MyConfig.media_address;

  constructor(
    private route: ActivatedRoute,
    private userFollowService: UserFollowService,
    private location : Location,
    private router : Router,
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.params['id']);
    this.loadFollowers();
  }

  loadFollowers(): void {
    this.userFollowService.getFollowingAndFollowers(this.userId).subscribe({
      next: (response) => {
        this.followers = response.followers;
      },
      error: (err) => {
        console.error('Error fetching followers:', err);
      },
    });
  }

  openProfile(userId: number): void {
    console.log(userId);
    this.router.navigate(['listener/user/', userId]);
  }

  goBack() {
    this.location.back();
  }
}
