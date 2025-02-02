using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.PlaylistEndpoints
{
    public class PlaylistAddCollaboratorEndpoint(ApplicationDbContext db)
        : MyEndpointBaseAsync.WithRequest<AddCollabRequest>.WithActionResult<AddCollabResponse>
    {
        [HttpPut]
        public override async Task<ActionResult<AddCollabResponse>> HandleAsync(AddCollabRequest request, CancellationToken cancellationToken)
        {
            var playlist = await db.Playlists
                .Include(p => p.UserPlaylists)
                .FirstOrDefaultAsync(p => p.Id == request.PlaylistId, cancellationToken);

            if (playlist == null)
            {
                return BadRequest(new AddCollabResponse { Success = false, Message = "Playlist does not exist." });
            }

            var owner = playlist.UserPlaylists.FirstOrDefault(up => up.MyAppUserId == request.OwnerId && up.IsOwner);

            if (owner == null)
            {
                return BadRequest(new AddCollabResponse { Success = false, Message = "User is not the owner of the playlist." });
            }

            var collaboratorExists = await db.MyAppUsers
                .AnyAsync(u => u.ID == request.CollaboratorId, cancellationToken);

            if (!collaboratorExists)
            {
                return BadRequest(new AddCollabResponse { Success = false, Message = "Collaborator does not exist." });
            }

            var existingEntry = playlist.UserPlaylists.FirstOrDefault(up => up.MyAppUserId == request.CollaboratorId);

            if (existingEntry != null)
            {
                if (!existingEntry.IsOwner)
                {
                    db.UserPlaylist.Remove(existingEntry);
                    await db.SaveChangesAsync(cancellationToken);

                    if (!playlist.UserPlaylists.Any(up => !up.IsOwner))
                    {
                        playlist.IsCollaborative = false;
                        await db.SaveChangesAsync(cancellationToken);
                    }

                    return Ok(new AddCollabResponse { Success = true, Message = "Collaborator removed from playlist." });
                }

                return BadRequest(new AddCollabResponse { Success = false, Message = "User is already the owner of the playlist." });
            }

            playlist.UserPlaylists.Add(new UserPlaylist
            {
                MyAppUserId = request.CollaboratorId,
                PlaylistId = request.PlaylistId,
                IsOwner = false
            });

            if (!playlist.IsCollaborative)
            {
                playlist.IsCollaborative = true;
            }

            await db.SaveChangesAsync(cancellationToken);

            return Ok(new AddCollabResponse { Success = true, Message = "Collaborator added to playlist." });
        }
    }

    public class AddCollabRequest
    {
        public int OwnerId { get; set; }
        public int CollaboratorId { get; set; }
        public int PlaylistId { get; set; }
    }

    public class AddCollabResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }
}
