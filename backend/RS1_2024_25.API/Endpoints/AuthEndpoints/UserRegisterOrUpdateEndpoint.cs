using RS1_2024_25.API.Data.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using RS1_2024_25.API.Helper.Api;
using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace RS1_2024_25.API.Endpoints.AuthEndpoints
{
    public class UserRegisterOrUpdateEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<RegisterRequest>.WithActionResult
    {
        [HttpPost]
        public override async Task<ActionResult> HandleAsync([FromBody] RegisterRequest request, CancellationToken cancellationToken = default)
        {
            //Validate request object
            if(!request.HandleValidation())
            {
                return BadRequest("Bad data (failed validation)");
            }

            MyAppUser user;

            if(request.ID != null)
            {
                user = await db.MyAppUsers.FindAsync(request.ID, cancellationToken);
                if (user == null)
                {
                    return BadRequest("User account not found");
                }
                //Verify password hash
                else if(!BCrypt.Net.BCrypt.EnhancedVerify(request.Password, user.Password))
                {
                    return BadRequest("Username or password is incorrect");
                }
            }
            else
            {
                user = new MyAppUser();
                db.MyAppUsers.Add(user);
            }

            MyAppUser dupeUser = await db.MyAppUsers.FirstOrDefaultAsync(u => u.Username == request.Username && u.Email == request.Email);
            if(dupeUser != null)
            {
                return BadRequest("Account with this email or username already exists");
            }

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Email = request.Email;
            user.DateOfBirth = request.DateOfBirth;
            user.Username = request.Username;
            user.CountryId = request.CountryId;

            string passHash = BCrypt.Net.BCrypt.EnhancedHashPassword(request.Password);
            user.Password = passHash;

            await db.SaveChangesAsync();
            return Ok(request.ID == null ? "User account registered" : "User account updated");
        }
    }

    public class RegisterRequest : IValidatable
    {
        public int? ID { get; set; }
        public string Username { get; set; }
        public string Password { get; set; } 
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string Email { get; set; } = "admin@admin.com";
        public DateTime DateOfBirth { get; set; }
        public int CountryId { get; set; }

        public bool HandleValidation()
        {
            if (!Regex.IsMatch(this.Username, "^[a-zA-Z0-9.]{3,20}$"))
                return false;
            if (!Regex.IsMatch(this.Email, "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"))
                return false;
            if (!Regex.IsMatch(this.Password, "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
                return false;
            if (!Regex.IsMatch(this.Password, "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
                return false;
            if (!Regex.IsMatch(this.FirstName, "^[a-zA-Z'’\\- ]{1,50}$"))
                return false;            
            if (!Regex.IsMatch(this.LastName, "^[a-zA-Z'’\\- ]{1,50}$"))
                return false;
            return true;
        }
    }
}
