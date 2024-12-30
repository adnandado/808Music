﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.FollowEndpoints
{
    public class ToggleNotificationsEndpoint(ApplicationDbContext db, TokenProvider tp) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult
    {
        [Authorize]
        [HttpPost("{id}")]
        public async override Task<ActionResult> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            int userId = int.Parse(tp.GetJwtSub(Request));

            Follow? check = await db.Follows.Where(f => f.MyAppUserId == userId && f.ArtistId == id).FirstOrDefaultAsync();
            if (check == null)
            {
                return BadRequest();
            }

            check.WantsNotifications = !check.WantsNotifications;
            await db.SaveChangesAsync();
            return check.WantsNotifications ? Ok("Notifications On") : Ok("Notifications Off");
        }
    }
}
