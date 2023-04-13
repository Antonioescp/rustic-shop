namespace RusticShopAPI.Services.Mail
{
    public interface IMailService
    {
        Task<bool> SendEmailAsync(MailData mailData);
        Task<bool> SendEmailTemplateAsync(
            MailData mailData, 
            string templateName,
            params object?[] replacements);
    }
}
