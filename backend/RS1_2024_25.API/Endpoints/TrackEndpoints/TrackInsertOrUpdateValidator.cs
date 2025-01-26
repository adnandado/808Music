using FluentValidation;
using RS1_2024_25.API.Data;

namespace RS1_2024_25.API.Endpoints.TrackEndpoints
{
    public class TrackInsertOrUpdateValidator : AbstractValidator<TrackInsertRequest>
    {
        public TrackInsertOrUpdateValidator(ApplicationDbContext db)
        {
            RuleFor(x => x.Id).Must(x => x == null ? true : db.Tracks.Find(x) != null).WithMessage("Track with this ID not found.");

            RuleFor(x => x.Title).MinimumLength(3);

            RuleFor(x => x.TrackFile).Must(x =>
            {
                if(x == null)
                    return true;
                if(x.FileName.EndsWith(".mp3"))
                    return true;
                return false;
            }).WithMessage("For now .mp3 files are only allowed");

            RuleFor(x => x.AlbumId).NotEmpty().GreaterThan(0).Must(x => db.Albums.Find(x) != null).WithMessage("Album ID not valid");

            RuleFor(x => x.ArtistIds).Must(x =>
            {
                if(x.Count > 0)
                {
                    foreach(var artistId in x)
                    {
                        if(db.Artists.Find(artistId) == null)
                        {
                            return false;
                        }
                    }
                }
                return true;
            }).WithMessage("Featured artists not valid");

            RuleFor(x => x).Must(x =>
            {
                if(x.Id == null && x.TrackFile == null)
                {
                    return false;
                }
                return true;
            }).WithMessage("New tracks must upload an associated .mp3 file");
        }
    }
}
