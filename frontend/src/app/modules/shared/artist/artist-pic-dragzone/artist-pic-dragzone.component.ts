import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ArtistInsertRequest} from '../../../../endpoints/artist-endpoints/artist-insert-or-update-endpoint.service';
import {MyConfig} from '../../../../my-config';
import imageCompression, {Options} from 'browser-image-compression';

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
];

@Component({
  selector: 'app-artist-pic-dragzone',
  templateUrl: './artist-pic-dragzone.component.html',
  styleUrl: './artist-pic-dragzone.component.css'
})
export class ArtistPicDragzoneComponent implements OnChanges {
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

  selectFile(e: any) {
    let temp = (e.target.files[0] as File)
    if (this.allowedFileTypes.indexOf(temp.type) === -1) {
      alert('File type is not allowed.');
      return;
    }
    this.file = temp;
    /*
    console.log(this.file);
    this.fileUrl = URL.createObjectURL(this.file);
    this.imageEmit.emit(this.file);
    */

    const options : Options = {
      maxSizeMB:5,
      alwaysKeepResolution: true,
    }


    imageCompression(temp, options).then(val => {
      console.log(this.file);
      this.file = new File([val as Blob],val.name);
      this.fileUrl = URL.createObjectURL(this.file);
      this.imageEmit.emit(this.file);
    });
  }

  removeFile() {
    this.fileUrl = "";
    this.file = null;
    this.imageEmit.emit(undefined);
  }

  getFileName(name: string) {
    if(name.length > 20)
    {
      let i = name.lastIndexOf(".");
      return name.slice(0, 17) + "... " + name.substring(i, name.length);
    }

    return name;
  }
}
