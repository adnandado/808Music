import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'pass-strength-meter',
  templateUrl: './pass-strength-meter.component.html',
  styleUrl: './pass-strength-meter.component.css'
})
export class PassStrengthMeterComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.strengthPoints = 0;
  }

  @Input() password: string = "";
  strengthText : string = "";
  strengthPoints : number = 0;

  fillMeter(): any {
    if(this.password.length >= 8) {
      this.strengthPoints++;
    }
    if(this.password.length >= 12 && /[@$!%*?&]{2,}/.test(this.password)) {
      this.strengthPoints++;
    }
    if(/[a-z]/.test(this.password)) {
      this.strengthPoints++;
    }
    if(/[A-Z]/.test(this.password)) {
      this.strengthPoints++;
    }
    if(/[0-9]/.test(this.password)) {
      this.strengthPoints++;
    }
    if(/[@$!%*?&]/.test(this.password)) {
      this.strengthPoints++;
    }

    switch (this.strengthPoints) {
        case 0:
          this.strengthText = "";
          return {
            'width': '0%',
          }
        case 1:
          this.strengthText = "Password is very weak."
          return {
            'width': '10%',
            'background-color': 'red',
          }
        case 2:
          this.strengthText = "Password is weak."
          return {
            'width': '30%',
            'background-color': 'coral',
          }
        case 3:
          this.strengthText = "Password is moderate."
          return {
            'width': '60%',
            'background-color': 'yellow',
          }
        case 4:
          this.strengthText = "Password is moderate."
          return {
            'width': '80%',
            'background-color': 'lightgreen',
          }
        case 5:
          this.strengthText = "Password is strong."
          return {
            'width': '90%',
            'background-color': 'lawngreen',
          }
        case 6:
          this.strengthText = "Password is very strong."
          return {
            'width': '100%',
            'background-color': 'green',
          }
    }
  }
}
