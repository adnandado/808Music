﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services.Interfaces;

namespace RS1_2024_25.API.Endpoints.UserEndpoints
{
    public class UserSearchEndpoint(ApplicationDbContext db, IMyCacheService cs) : MyEndpointBaseAsync.WithRequest<UserSearchRequest>.WithActionResult<List<UserSearchResponse>>
    {
        [Authorize]
        [HttpGet]
        public override async Task<ActionResult<List<UserSearchResponse>>> HandleAsync([FromQuery] UserSearchRequest request, CancellationToken cancellationToken = default)
        {
            var users = await cs.GetAsync<List<MyAppUser>>("users", async () =>
            {
                List<MyAppUser> users = await db.MyAppUsers.ToListAsync();
                return users;
            }, cancellationToken);

            var queryable = users.AsQueryable();

            if(request.SearchString != string.Empty)
            {
                return Ok(queryable.Where(u => u.Username.ToLower().Contains(request.SearchString.ToLower())).Take(5).Select(a => new UserSearchResponse
                {
                    Id = a.ID,
                    Username = a.Username
                }).ToList());
            }
            else
            {
                return Ok(queryable.Take(5).Select(a => new UserSearchResponse
                {
                    Id = a.ID,
                    Username = a.Username
                }).ToList());
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
