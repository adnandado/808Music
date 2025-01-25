using FluentValidation;
using RS1_2024_25.API.Data;

namespace RS1_2024_25.API.Endpoints.AlbumEndpoints
{
    public class AlbumInsertOrUpdateValidator : AbstractValidator<AlbumInsertRequest>
    {
        public AlbumInsertOrUpdateValidator(ApplicationDbContext db)
        {
            RuleFor(x => x.Title).MinimumLength(3).WithMessage("Album Title must be at least 3 characters long.");

            RuleFor(x => x.Distributor).MinimumLength(3).WithMessage("Album Distrubutor must be at least 3 characters long.");

            RuleFor(x => x.AlbumTypeId).NotEmpty().GreaterThan(0).Must(x => db.AlbumTypes.Find(x) != null).WithMessage("Invalid Album Type");

            RuleFor(x => x.ArtistId).NotEmpty().GreaterThan(0).Must(x => db.Artists.Find(x) != null).WithMessage("Invalid Artist");

            RuleFor(x => x.Id).Must(x => x != null ? db.Albums.Find(x) != null : true).WithMessage("Album with this ID not found");

            RuleFor(x => x.CoverImage).Must(x =>
            {
                if (x == null)
                {
                    return true;
                }
                if (x.FileName.EndsWith(".png") || x.FileName.EndsWith(".jpg") || x.FileName.EndsWith(".jpeg"))
                {
                    return true;
                }
                return false;
            }).WithMessage("Accepted Image formats are .jpg and .png");
        }
    }
}
