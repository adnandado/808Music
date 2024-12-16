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

  @Output() onEdit: EventEmitter<number> = new EventEmitter();
  @Output() onStats: EventEmitter<number> = new EventEmitter();
  @Output() onDelete: EventEmitter<number> = new EventEmitter();
  @Output() onClick: EventEmitter<number> = new EventEmitter();

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
    return this.title.length > 15 ? this.title.slice(0,10) + "..." : this.title;
  }

  emitClick() {
    this.onClick.emit(this.id);
  }
}
