import {AfterViewInit, Component, inject, Inject, OnInit} from '@angular/core';
import {MusicPlayerService} from '../../../services/music-player.service';
import {TrackGetByIdEndpointService} from '../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MyConfig} from '../../../my-config';
import {windowWhen} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-play-track',
  templateUrl: './play-track.component.html',
  styleUrl: './play-track.component.css'
})
export class PlayTrackComponent implements AfterViewInit {
  dialog = inject(MatDialog);

  constructor(private musicPlayerService: MusicPlayerService,
              private getTrackByIdService : TrackGetByIdEndpointService,
              private route : ActivatedRoute,
              private router : Router,) {
  }

  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      if(id)
      {
        this.getTrackByIdService.handleAsync(id as number).subscribe({
          next: data => {
            let matRef = this.dialog.open(ConfirmDialogComponent,
              {data: {title: "Do you want to play this song", content: ""}, hasBackdrop:true})
            matRef.afterClosed().subscribe({next: wantsPlay => {
              if(wantsPlay)
              {
                this.musicPlayerService.createQueue([data],{display: data.title, value: MyConfig.ui_address+"/listener/home"})
              }
                this.router.navigate(["/listener/home"]);
            }})
          }
        })
      }
    })

  }
}
