import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-playlist-card',
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.css']
})
export class PlaylistCardComponent {
  @Input() title: string = "";
  @Input() username: string = "";
  @Input() subtitle: string = "";
  @Input() imageUrl: string = "";
  @Input() hasControls: boolean = false;
  @Input() id: number = 0;
  @Input() tooltip = "";

  @Output() onEdit: EventEmitter<number> = new EventEmitter();
  @Output() onStats: EventEmitter<number> = new EventEmitter();
  @Output() onDelete: EventEmitter<number> = new EventEmitter();
  @Output() onClick: EventEmitter<number> = new EventEmitter();

  replaceWithPlaceholder() {
    document.getElementById("thumbnail")!.classList.add("playlist-mat-card-placeholder");
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
    return this.title && this.title.length > 15 ? this.title.slice(0, 10) + "..." : this.title || 'Untitled Playlist';
  }
  getAuthor(): string {
    return this.username ? this.username : 'Nepoznato';
  }


  emitClick() {
    this.onClick.emit(this.id);
  }

  openPlaylist() {
    this.onClick.emit(this.id);
  }
}
