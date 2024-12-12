import {Component, Input, OnInit} from '@angular/core';
import {MyConfig} from '../../../my-config';
import {ArtistTrackDto, TrackGetResponse} from '../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';
import {MatTableDataSource} from '@angular/material/table';
import {TrackWithPositionDto} from '../../../services/auth-services/dto/TrackWithPositionDto';
import {ArtistSimpleDto} from '../../../services/auth-services/dto/artist-dto';

@Component({
  selector: 'app-tracks-table',
  templateUrl: './tracks-table.component.html',
  styleUrl: './tracks-table.component.css'
})
export class TracksTableComponent implements OnInit {
  @Input() isArtistMode = true;
  @Input() isPlaylist = false;

  ngOnInit(): void {
      for(let i = 0; i < this.tracks.length; i++) {
        this.tracksDto.push({
          artists: this.tracks[i].artists,
          id: this.tracks[i].id,
          length: this.tracks[i].length,
          coverPath: MyConfig.api_address + this.tracks[i].coverPath,
          position: i+1,
          isExplicit: this.tracks[i].isExplicit,
          streams: this.tracks[i].streams,
          title: this.tracks[i].title
        });
      }
      console.log(this.tracksDto);
      this.dataSource.data = this.tracksDto;
  }
  protected readonly MyConfig = MyConfig;
  @Input() tracks: TrackGetResponse[] = [];
  tracksDto : TrackWithPositionDto[] = []
  displayedColumns = ["position", "title", "duration", "streams"];
  dataSource = new MatTableDataSource<TrackWithPositionDto>(this.tracksDto);

  getPosition(id:number) {
    return (this.tracksDto.find(x => x.id === id))?.position.toString();
  }

  getArtists(id:number) {
    let track = this.tracksDto.find(x => x.id === id)!;
    let artists = "";
    for (let i = 0; i < track.artists.length; i++) {
      artists += i == 0 ? track.artists[i].name : ', ' + track.artists[i].name;
    }
    return artists;
  }

  getDuration(id:number) {
    let track = this.tracksDto.find(x => x.id === id)!;
    let minutes = Math.floor(track.length / 60).toString();
    let seconds = (track.length % 60).toFixed(0);

    if(Number(seconds) < 10){
      seconds = '0' + seconds;
    }
    return `${minutes}:${seconds}`;
  }

  goToArtistProfile(artist: ArtistSimpleDto | ArtistTrackDto) {
    //TODO: Implement when user side profiles are made
    console.log(artist);
  }
}
