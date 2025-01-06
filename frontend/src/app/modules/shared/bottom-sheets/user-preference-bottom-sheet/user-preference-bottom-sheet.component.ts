import {Component, Inject, inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {TrackGetResponse} from '../../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';
import {MusicPlayerService} from '../../../../services/music-player.service';
import {
  MyAppUserPreference, NotificationSetPreferenceEndpointService
} from '../../../../endpoints/notification-endpoints/notification-set-preference-endpoint.service';
import {FormControl, FormGroup} from '@angular/forms';
import {
  NotificationGetTypesEndpointService
} from '../../../../endpoints/notification-endpoints/notification-get-types-endpoint.service';
import {
  NotificationGetPreferenceEndpointService
} from '../../../../endpoints/notification-endpoints/notification-get-preference-endpoint.service';
@Component({
  selector: 'app-user-preference-bottom-sheet',
  templateUrl: './user-preference-bottom-sheet.component.html',
  styleUrl: './user-preference-bottom-sheet.component.css'
})
export class UserPreferenceBottomSheetComponent implements OnInit {
  notiTypes :string[] = [];
  preferences! : MyAppUserPreference;
  private sheetRef = inject<MatBottomSheetRef<UserPreferenceBottomSheetComponent>>(MatBottomSheetRef);
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) protected data: {preference: MyAppUserPreference | null},
              private notiTypeService: NotificationGetTypesEndpointService,
              private getPreferenceService: NotificationGetPreferenceEndpointService,
              private setPreferenceService: NotificationSetPreferenceEndpointService) { }

  ngOnInit(): void {
    this.notiTypeService.handleAsync().subscribe({next: data => {
      this.notiTypes = data;
    }})

    this.getPreferenceService.handleAsync().subscribe({
      next: data => {
        this.preferences = data;
        this.form.get('allowPushNotifications')?.setValue(data.allowPushNotifications);
        this.form.get('allowEmailNotifications')?.setValue(data.allowEmailNotifications);
        this.form.get('notificationTypePriority')?.setValue(data.notificationTypePriority);
    }})
  }

  form = new FormGroup({
    allowPushNotifications: new FormControl<boolean>(false),
    allowEmailNotifications: new FormControl<boolean>(false),
    notificationTypePriority: new FormControl<string>(''),
  })

  closeSheet(b: boolean) {
    if(!b)
    {
      this.sheetRef.dismiss(b);
    }
    else {
      this.setPreferenceService.handleAsync({
        allowEmailNotifications: this.form.value.allowEmailNotifications!,
        allowPushNotifications: this.form.value.allowPushNotifications!,
        notificationTypePriority: this.form.value.notificationTypePriority!
      }).subscribe({next: data => {
        this.sheetRef.dismiss(b);
      }})
    }
  }

}
