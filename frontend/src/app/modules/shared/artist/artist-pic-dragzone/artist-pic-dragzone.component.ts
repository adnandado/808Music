import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ArtistInsertRequest} from '../../../../endpoints/artist-endpoints/artist-insert-or-update-endpoint.service';
import {MyConfig} from '../../../../my-config';
import imageCompression, {Options} from 'browser-image-compression';
import {ImageCroppedEvent} from 'ngx-image-cropper';

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
];

@Component({
  selector: 'app-artist-pic-dragzone',
  templateUrl: './artist-pic-dragzone.component.html',
  styleUrl: './artist-pic-dragzone.component.css'
})
export class ArtistPicDragzoneComponent implements OnChanges, OnInit {
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
  imageChangedEvent : any | null = null;
  @Input() withCrop = false;
  @Input() cropAspectRatio= 1171 / 311;
  @Input() containInAspectRatio = false;

  selectFile(e: any) {
    let temp = (e.target.files[0] as File)
    if (this.allowedFileTypes.indexOf(temp.type) === -1) {
      alert('File type is not allowed.');
      return;
    }
    if(this.withCrop)
    {
      this.file = temp;
      this.fileUrl = URL.createObjectURL(this.file);
      this.imageEmit.emit(this.file);
    }
    else {
      this.setFile(temp);
    }
  }

  removeFile() {
    this.fileUrl = "";
    this.file = null;
    if(this.inputElement){
      this.inputElement.value = "";
    }
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

  imageCropped(img: ImageCroppedEvent) {
    let file = new File([img.blob!], "Artist Banner", {type: img.blob!.type});

    const options : Options = {
      maxSizeMB:5,
      alwaysKeepResolution: true,
    }

    imageCompression(file, options).then(val => {
      file = new File([val as Blob], val.name + '.png', {type: val.type});
      console.log(this.file);
      this.fileUrl = URL.createObjectURL(file);
      this.imageEmit.emit(file);
    });
  }

  loadImageFailed() {
    console.log("Image loading failed.");
  }

  private setFile(temp: File) {
    this.file = temp;

    const options : Options = {
      maxSizeMB:5,
      alwaysKeepResolution: true,
    }

    imageCompression(temp, options).then(val => {
      this.file = new File([val as Blob], val.name, {type: val.type});
      console.log(this.file);
      this.fileUrl = URL.createObjectURL(this.file);
      this.imageEmit.emit(this.file);
    });
  }

  private cropFile(temp: File) {
    this.setFile(temp);
    console.log(temp);
  }
}
