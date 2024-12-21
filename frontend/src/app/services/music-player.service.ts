import {EventEmitter, Injectable} from '@angular/core';
import {TrackGetResponse} from '../endpoints/track-endpoints/track-get-by-id-endpoint.service';
import {Subject} from 'rxjs';

export interface QueueSource {
  display: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class MusicPlayerService {
  queueSource: QueueSource = {display:"Song", value:"song"};
  queue : TrackGetResponse[] = []
  private playedIndexes : number[] = []
  private trackPlayEvent = new Subject<TrackGetResponse>();
  trackEvent = this.trackPlayEvent.asObservable();

  constructor() { }

  createQueue(queue : TrackGetResponse[], source : QueueSource = {display:"Song", value:"song"}, append : boolean = false) {
    if(!append || this.queue.length == 0) {
      this.queue = queue;
      this.playedIndexes = []
      this.playNext();
    }
    else {
      this.queue.push(...queue);
    }
    this.queueSource = source;
  }

  addToQueue(queueTrack : TrackGetResponse) {
      this.queue.push(queueTrack);
  }

  playNext() {
    if(this.playedIndexes.length == 0)
    {
      this.trackPlayEvent.next(this.queue[0]);
      this.playedIndexes.push(0);
      return;
    }

    let i = this.playedIndexes[this.playedIndexes.length - 1] + 1;
    if(this.queue.length <= i)
    {
      return;
    }
    this.playedIndexes.push(i);
    this.trackPlayEvent.next(this.queue[i]);
  }

  playPrev() {
    if(this.playedIndexes.length <= 1)
    {
      return;
    }
    let i = this.playedIndexes.pop()!;
    i = this.playedIndexes.pop()!;
    this.playedIndexes.push(i);
    this.trackPlayEvent.next(this.queue[i]);
  }

  shufflePlay() {
    let i = this.getRandomInt(0, this.queue.length);
    let attempts = 1;
    while(this.playedIndexes.includes(i))
    {
      i = this.getRandomInt(0, this.queue.length);
      attempts++;
      if(attempts > this.queue.length)
      {
        return;
      }
    }
    this.playedIndexes.push(i);
    this.trackPlayEvent.next(this.queue[i]);
  }

  getRandomInt(min :number, max:number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }
}
