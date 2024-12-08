import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ArtistInsertRequest} from '../../../../endpoints/artist-endpoints/artist-insert-or-update-endpoint.service';
import {MyConfig} from '../../../../my-config';

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
];

@Component({
  selector: 'app-artist-pic-dragzone',
  templateUrl: './artist-pic-dragzone.component.html',
  styleUrl: './artist-pic-dragzone.component.css'
})
export class ArtistPicDragzoneComponent {
  readonly url = MyConfig.api_address;
  @Output() imageEmit: EventEmitter<File | undefined> = new EventEmitter<File | undefined>();
  @Input() title: string = "";
  @Input() file : File | null = null;
  @Input() type: string = "pfp";
  @Input() fileUrl = "";
  allowedFileTypes = ALLOWED_FILE_TYPES;

  selectFile(e: any) {
    if (this.allowedFileTypes.indexOf((e.target.files[0] as File).type) === -1) {
      alert('File type is not allowed.');
      return;
    }

    this.file = e.target.files[0] as File;


    this.fileUrl = URL.createObjectURL(this.file);
    this.imageEmit.emit(this.file);
  }

  removeFile() {
    this.fileUrl = "";
    this.file = null;
    this.imageEmit.emit(undefined);
  }
}
