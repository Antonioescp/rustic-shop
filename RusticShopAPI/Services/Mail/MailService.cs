using MailKit;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;

namespace RusticShopAPI.Services.Mail
{
    public class MailService : IMailService
    {
        private readonly MailSettings _mailSettings;

        public MailService(IOptions<MailSettings> mailSettingsOptions)
        {
            _mailSettings = mailSettingsOptions.Value;
        }

        public async Task<bool> SendEmailAsync(MailData mailData)
        {
            try
            {
                using var emailMessage = new MimeMessage();
                var emailFrom = new MailboxAddress(
                    _mailSettings.SenderName, 
                    _mailSettings.SenderEmail);
                emailMessage.From.Add(emailFrom);
                var emailTo = new MailboxAddress(
                    mailData.EmailToName,
                    mailData.EmailToId);
                emailMessage.To.Add(emailTo);

                emailMessage.Subject = mailData.EmailSubject;
                var emailBodyBuilder = new BodyBuilder
                {
                    TextBody = mailData.EmailBody
                };
                emailMessage.Body = emailBodyBuilder.ToMessageBody();

                using var mailClient = new SmtpClient();
                await mailClient.ConnectAsync(
                    _mailSettings.Server,
                    _mailSettings.Port,
                    MailKit.Security.SecureSocketOptions.StartTls);
                await mailClient.AuthenticateAsync(
                    _mailSettings.UserName,
                    _mailSettings.Password);
                await mailClient.SendAsync(emailMessage);
                await mailClient.DisconnectAsync(true);

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
