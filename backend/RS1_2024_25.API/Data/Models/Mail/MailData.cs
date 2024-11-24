using System.Text;

namespace RS1_2024_25.API.Data.Models.Mail
{
    public class MailData
    {
        public string Subject { get; set; }
        public StringBuilder Body { get; set; }
        public string To { get; set; }
        public bool IsBodyHtml { get; set; }
    }
}
