    using Microsoft.EntityFrameworkCore;
    using Org.BouncyCastle.Bcpg;
    using System.ComponentModel.DataAnnotations;

    namespace RS1_2024_25.API.Data.Models
    {
        public class Subscription
        {
            [Key]
            public int Id { get; set; }    
            public bool IsActive { get; set; }
            public DateTime StartedDate { get; set; }
            public DateTime EndDate { get; set; }   
            public DateTime ReedemsOn { get; set; }
            public int SubscriptionType { get; set; }
        public float MonthlyPrice { get; set; }
            public bool RenewalOn { get; set; }
        }
    }
