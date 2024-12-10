using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using System.Web;
using System.Threading;
using Microsoft.AspNetCore.Http.HttpResults;
using RS1_2024_25.API.Services.Interfaces;

namespace RS1_2024_25.API.Services
{
    public class DeleteService(ApplicationDbContext db, IConfiguration cfg, IMyFileHandler fh)
    {
        public async Task<bool> DeleteTrackAsync(Track track)
        {

            var artistTracks = await db.ArtistsTracks.Where(at => at.TrackId == track.Id).ToListAsync();
            var trackGenres = await db.TrackGenres.Where(at => at.TrackId == track.Id).ToListAsync();
            var credits = await db.Credits.FindAsync(track.Id);
            //also remove from playlists when added

            db.ArtistsTracks.RemoveRange(artistTracks);
            db.TrackGenres.RemoveRange(trackGenres);
            if (credits != null)
            {
                db.Credits.Remove(credits);
            }
            await db.SaveChangesAsync();

            if (track.TrackPath != "")
            {
                fh.DeleteFile(cfg["StaticFilePaths:Tracks"] + track.TrackPath);
            }
            db.Tracks.Remove(track);
            await db.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAlbumAsync(Album album)
        {
            var tracks = await db.Tracks.Where(t => t.AlbumId == album.Id).ToListAsync();
            foreach (Track track in tracks)
            {
                await this.DeleteTrackAsync(track);
            }

            if(album.CoverPath != "")
            {
                fh.DeleteFile(cfg["StaticFilePaths:AlbumCovers"] + album.CoverPath);
            }
            db.Albums.Remove(album);
            await db.SaveChangesAsync();

            return true;
        }
    }
}
