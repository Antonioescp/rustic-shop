namespace RusticShopAPI.Services.Mail
{
    public interface IMailService
    {
        Task<bool> SendEmailAsync(MailData mailData);
    }
}
