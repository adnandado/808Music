import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToDurationString'
})
export class SecondsToDurationStringPipe implements PipeTransform {

  transform(value: number | undefined): string {
    if(value === undefined || value === null) {
      return '';
    }
    let minutes = Math.floor(value / 60).toString();
    let seconds = (value % 60).toFixed(0);

    if(Number(seconds) < 10){
      seconds = '0' + seconds;
    }
    return `${minutes}:${seconds}`;
  }

}
