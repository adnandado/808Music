using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.ArtistEndpoints
{
    public class ArtistGetFollowedByUserEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithoutRequest.WithActionResult<List<ArtistFollowResponse>>
    {
        [Authorize]
        [HttpGet]
        public override async Task<ActionResult<List<ArtistFollowResponse>>> HandleAsync(CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));

            await db.Artists.LoadAsync(cancellationToken);
            var artists = await db.Follows.Where(f => f.MyAppUserId == userId).OrderByDescending(f => f.Artist.Followers).Select(f => new ArtistFollowResponse
            {
                Id = f.Artist.Id,
                IsFlaggedForDeletion = f.Artist.IsFlaggedForDeletion,
                DeletionDate = f.Artist.DeletionDate.ToShortDateString(),
                Name = f.Artist.Name,
                PfpPath = $"/media/Images/ArtistPfps/{f.Artist.ProfilePhotoPath}",
                Role = "",
                WantsNotifications = f.WantsNotifications
            }).ToListAsync();

            return artists != null ? artists : new List<ArtistFollowResponse>();
        }
    }

    public class ArtistFollowResponse : ArtistResponse
    {
        public bool WantsNotifications { get; set; }
    }
}
