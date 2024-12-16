import {TrackGetResponse} from '../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';

export interface TrackWithPositionDto extends TrackGetResponse {
  position: number;
}
