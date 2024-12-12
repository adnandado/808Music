import {Component, EventEmitter, input, Input, Output} from '@angular/core';
import {ArtistSimpleDto} from '../../../../services/auth-services/dto/artist-dto';
import {MyConfig} from '../../../../my-config';

@Component({
  selector: 'app-artist-small-card',
  templateUrl: './artist-small-card.component.html',
  styleUrl: './artist-small-card.component.css'
})
export class ArtistSmallCardComponent {
  @Input() artist : ArtistSimpleDto | null = null;
  @Input() interactive: boolean = false;

  @Output() onRemove: EventEmitter<ArtistSimpleDto> = new EventEmitter<ArtistSimpleDto>();

  protected readonly MyConfig = MyConfig;

  emitClick() {
    if(this.artist){
      this.onRemove.emit(this.artist);
    }
  }
}
