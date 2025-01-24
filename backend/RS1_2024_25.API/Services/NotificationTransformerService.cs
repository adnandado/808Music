using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;

namespace RS1_2024_25.API.Services
{
    public class NotificationTransformerService(ApplicationDbContext db, IConfiguration cfg)
    {
        public async Task<RichNotification> GetRichNotificationAsync(Notification notification, CancellationToken cancellationToken = default)
        {
            await db.Artists.LoadAsync();
            await db.AlbumTypes.LoadAsync();
            switch(notification.Type)
            {
                case nameof(Album):
                    return await db.Albums.Where(a => a.Id == notification.ContentId).Select(a => new RichNotification
                    {
                        Id = notification.Id,
                        Artist = a.Artist,
                        Title = a.Title,
                        ContentId = a.Id,
                        CreatedAt = notification.CreatedAt,
                        Type = notification.Type,
                        Message = $"New {a.AlbumType.Type} out now!",
                        ImageUrl = $"/media/Images/AlbumCovers/{a.CoverPath}"
                    }).FirstOrDefaultAsync();
                case nameof(Product):
                    await db.ProductPhotos.LoadAsync(cancellationToken);
                    return await db.Products.Where(a => a.Id == notification.ContentId).Select(a => new RichNotification
                    {
                        Id = notification.Id,
                        Artist = a.Artist,
                        Title = a.Title,
                        ContentId = a.Id,
                        CreatedAt = notification.CreatedAt,
                        Type = notification.Type,
                        Message = $"New {a.ProductType.ToString()} out now!",
                        ImageUrl = a.Photos.First() != null ? "/media" + a.Photos.First().ThumbnailPath : "/media/Images/liked_songs.png",
                        Slug = a.Slug
                    }).FirstOrDefaultAsync();
                default: return new RichNotification();
            }
        }
    }

    public class RichNotification
    {
        public int Id { get; set; }
        public int ContentId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public Artist? Artist { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool Priority { get; set; } = false;
        public string? Slug { get; set; }
    }
}
