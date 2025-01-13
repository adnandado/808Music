using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Services.Interfaces;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RS1_2024_25.API.Endpoints.UserEndpoints
{
    [ApiController]
    [Route("api/users")]
    public class UserProfilePictureEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IMyFileHandler _fh;
        private readonly IConfiguration _cfg;

        public UserProfilePictureEndpoint(ApplicationDbContext db, IMyFileHandler fh, IConfiguration cfg)
        {
            _db = db;
            _fh = fh;
            _cfg = cfg;
        }

        [HttpPost]
        [Route("upload-profile-picture")]
        public async Task<ActionResult> UploadProfilePicture([FromForm] UserProfilePictureRequest request, CancellationToken cancellationToken = default)
        {
            if (!request.UserId.HasValue)
            {
                return BadRequest("User ID is required.");
            }

            int userId = request.UserId.Value;

            var user = await _db.MyAppUsers.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (!string.IsNullOrEmpty(user.pfpCoverPath) && user.pfpCoverPath != "/Images/ProfilePictures/placeholder.png")
            {
                try
                {
                    _fh.DeleteFile(_cfg["StaticFilePaths:CoverImages"] + user.pfpCoverPath);
                }
                catch (Exception ex)
                {
                    return NotFound("Not found");
                }
            }

            if (request.ProfileImage != null)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(request.ProfileImage.FileName);
                var filePath = Path.Combine("wwwroot/images/ProfilePictures", fileName);

                var directoryPath = Path.GetDirectoryName(filePath);
                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await request.ProfileImage.CopyToAsync(stream, cancellationToken);
                }

                user.pfpCoverPath = $"/images/ProfilePictures/{fileName}";
                _db.MyAppUsers.Update(user);
                await _db.SaveChangesAsync(cancellationToken);

                return Ok(new { Message = "Profile picture set successfully.", ProfilePicturePath = user.pfpCoverPath });
            }

            return BadRequest("Profile picture not set correctly.");
        }
    }

    public class UserProfilePictureRequest
    {
        public int? UserId { get; set; } 
        public IFormFile? ProfileImage { get; set; }
    }
}
