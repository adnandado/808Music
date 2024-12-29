import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-album-card',
  templateUrl: './album-card.component.html',
  styleUrl: './album-card.component.css'
})
export class AlbumCardComponent {
  @Input() title: string = "";
  @Input() subtitle: string = "";
  @Input() imageUrl: string = "";
  @Input() hasControls: boolean = false;
  @Input() id: number = 0;
  @Input() tooltip = "";
  @Input() artistName = "";
  @Input() numOfTracks = -1;

  @Output() onEdit: EventEmitter<number> = new EventEmitter();
  @Output() onStats: EventEmitter<number> = new EventEmitter();
  @Output() onDelete: EventEmitter<number> = new EventEmitter();
  @Output() onClick: EventEmitter<number> = new EventEmitter();
  @Output() onPlayClick: EventEmitter<number> = new EventEmitter();
  playBtnStyle = {
    'display': 'none',
  }

  replaceWithPlaceholder() {
    document.getElementById("thumbnail")!.classList.add("album-mat-card-placeholder");
  }

  emitDelete() {
    this.onDelete.emit(this.id);
  }

  emitStats() {
    this.onStats.emit(this.id);
  }

  emitEdit() {
    this.onEdit.emit(this.id);
  }

  getTitle() {
    return this.title.length > 16 ? this.title.slice(0,13) + "..." : this.title;
  }

  emitClick() {
    this.onClick.emit(this.id);
  }

  showPlayButton() {
    this.playBtnStyle = {
      'display': 'block',
    }
  }

  hidePlayButton() {
    this.playBtnStyle = {
      'display': 'none',
    }
  }

  emitPlayClick() {
    this.onPlayClick.emit(this.id);
  }

}
