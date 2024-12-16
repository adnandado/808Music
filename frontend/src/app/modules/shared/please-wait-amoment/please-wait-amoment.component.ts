import {Component, inject, OnInit} from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

@Component({
  selector: 'app-please-wait-amoment',
  templateUrl: './please-wait-amoment.component.html',
  styleUrl: './please-wait-amoment.component.css',
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class PleaseWaitAMomentComponent implements OnInit {
  location = inject(Location)
    ngOnInit(): void {
        setTimeout(() => {
          this.location.back();
        },2500)
    }
}
