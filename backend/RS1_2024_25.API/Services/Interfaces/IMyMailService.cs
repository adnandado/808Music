using RS1_2024_25.API.Data.Models.Mail;

namespace RS1_2024_25.API.Services.Interfaces
{
    public interface IMyMailService
    {
        public Task Send(MailData data);
    }
}
