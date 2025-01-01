import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ArtistInsertRequest} from '../../../../endpoints/artist-endpoints/artist-insert-or-update-endpoint.service';
import {MyConfig} from '../../../../my-config';
import {ControlValueAccessor, FormControl} from '@angular/forms';

const ALLOWED_FILE_TYPES = [
  'audio/mpeg',
  'audio/wav',
];

@Component({
  selector: 'app-music-track-dragzone',
  templateUrl: './music-track-dragzone.component.html',
  styleUrl: './music-track-dragzone.component.css'
})
export class MusicTrackDragzoneComponent implements OnChanges, OnInit {
  ngOnInit(): void {
    this.inputElement = document.getElementById("fileInput") as HTMLInputElement;
  }
  ngOnChanges(changes: SimpleChanges): void {
      this.removeFile();
  }

  readonly url = MyConfig.api_address;
  @Output() imageEmit: EventEmitter<File | undefined> = new EventEmitter<File | undefined>();
  @Input() title: string = "";
  file : File | null = null;
  @Input() type: string = "pfp";
  fileUrl = "";
  @Input() control : any;
  allowedFileTypes = ALLOWED_FILE_TYPES;
  inputElement: HTMLInputElement | null = null;

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
    if(this.inputElement){
      this.inputElement.value = "";
    }
    this.imageEmit.emit(undefined);
  }

  getFileName(file: File) {
    let index = file.name.lastIndexOf(".");
    return file.name.length > 30 ? file.name.slice(0,22) + "... " + file.name.slice(index, file.name.length) : file.name;
  }
}
