import {Component, Inject, inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {
  MyAppUserPreference,
  NotificationSetPreferenceEndpointService
} from '../../../../endpoints/notification-endpoints/notification-set-preference-endpoint.service';
import {
  NotificationGetTypesEndpointService
} from '../../../../endpoints/notification-endpoints/notification-get-types-endpoint.service';
import {
  NotificationGetPreferenceEndpointService
} from '../../../../endpoints/notification-endpoints/notification-get-preference-endpoint.service';
import {
  ArtistFollowResponse,
  ArtistGetFollowedByUserEndpointService
} from '../../../../endpoints/artist-endpoints/artist-get-followed-by-user-endpoint.service';
import {
  FollowOrUnfollowEndpointService
} from '../../../../endpoints/follow-endpoints/follow-or-unfollow-endpoint.service';
import {
  ToggleNotificationsEndpointService
} from '../../../../endpoints/follow-endpoints/toggle-notifications-endpoint.service';
import {MyUserAuthService} from '../../../../services/auth-services/my-user-auth.service';
import {ArtistSimpleDto} from '../../../../services/auth-services/dto/artist-dto';
import {ArtistTrackDto} from '../../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';

@Component({
  selector: 'app-manage-following-bottom-sheet',
  templateUrl: './manage-following-bottom-sheet.component.html',
  styleUrl: './manage-following-bottom-sheet.component.css'
})
export class ManageFollowingBottomSheetComponent implements OnInit {
  private sheetRef = inject<MatBottomSheetRef<ManageFollowingBottomSheetComponent>>(MatBottomSheetRef);
  following!: ArtistFollowResponse[];
  userId! : number;
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) protected data: {preference: MyAppUserPreference | null},
              private getFollowingService: ArtistGetFollowedByUserEndpointService,
              private followService: FollowOrUnfollowEndpointService,
              private toggleNotis: ToggleNotificationsEndpointService,
              private auth : MyUserAuthService) { }

  ngOnInit(): void {
    this.userId = this.auth.getAuthToken()!.userId;
    this.getFollowingService.handleAsync().subscribe({
      next: value =>
      {
        this.following = value;
      }
    })
  }

  dismiss() {
    this.sheetRef.dismiss();
  }

  removeArtist(a: ArtistSimpleDto | ArtistTrackDto) {
    this.following = this.following.filter(artist => artist.id !== a.id);
  }
}
