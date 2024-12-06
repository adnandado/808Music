﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;

namespace RS1_2024_25.API.Endpoints.UserEndpoints
{
    public class UserSearchEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<UserSearchRequest>.WithActionResult<List<UserSearchResponse>>
    {
        [Authorize]
        [HttpGet]
        public override async Task<ActionResult<List<UserSearchResponse>>> HandleAsync([FromQuery] UserSearchRequest request, CancellationToken cancellationToken = default)
        {
            if(request.SearchString != string.Empty)
            {
                return Ok(await db.MyAppUsers.AsQueryable().Where(u => u.Username.ToLower().Contains(request.SearchString.ToLower())).Take(5).Select(a => new UserSearchResponse
                {
                    Id = a.ID,
                    Username = a.Username
                }).ToListAsync());
            }
            else
            {
                return Ok(await db.MyAppUsers.AsQueryable().Take(5).Select(a => new UserSearchResponse
                {
                    Id = a.ID,
                    Username = a.Username
                }).ToListAsync());
            }
        }
    }

    public class UserSearchRequest
    {
        public string SearchString { get; set; } = string.Empty;
    }

    public class UserSearchResponse
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
    }
}
