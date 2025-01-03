export interface ArtistSimpleDto {
  id: number;
  name: string;
  pfpPath: string;
  role: string;
  isFlaggedForDeletion: boolean;
  deletionDate: string;
  followers?: number;
  streams?: number;
}
