import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'longDurationString'
})
export class LongDurationStringPipe implements PipeTransform {

  transform(lengthInSeconds: number | undefined): string {
    if(lengthInSeconds != undefined)
    {
      let hours = Math.floor(lengthInSeconds / 3600).toString();
      let minutes = Math.floor((lengthInSeconds % 3600)/60).toString();
      let seconds = Math.floor((lengthInSeconds % 3600)%60).toString();
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return "";
  }

}
