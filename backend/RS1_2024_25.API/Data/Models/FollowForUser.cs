using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models.Auth;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    [PrimaryKey(nameof(FollowerUserId), nameof(FollowedUserId))]

    public class FollowForUser
    {
        [ForeignKey(nameof(FollowerUser))]
        public int FollowerUserId { get; set; }
        public MyAppUser FollowerUser { get; set; }

        [ForeignKey(nameof(FollowedUser))]
        public int FollowedUserId { get; set; }
        public MyAppUser FollowedUser { get; set; }

        public DateTime StartedFollowing { get; set; }
    }
}
