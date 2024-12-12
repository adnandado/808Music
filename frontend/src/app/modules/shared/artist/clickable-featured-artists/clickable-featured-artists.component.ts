import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ArtistSimpleDto} from '../../../../services/auth-services/dto/artist-dto';
import {ArtistTrackDto} from '../../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';

@Component({
  selector: 'app-clickable-featured-artists',
  templateUrl: './clickable-featured-artists.component.html',
  styleUrl: './clickable-featured-artists.component.css'
})
export class ClickableFeaturedArtistsComponent {
  @Input() artists: ArtistSimpleDto[] | ArtistTrackDto[] | null = null;
  @Input() separator = ", ";
  @Output() onArtistClick: EventEmitter<ArtistSimpleDto | ArtistTrackDto> = new EventEmitter();

  emitArtist(artist : ArtistSimpleDto | ArtistTrackDto) {
    this.onArtistClick.emit(artist);
  }
}
