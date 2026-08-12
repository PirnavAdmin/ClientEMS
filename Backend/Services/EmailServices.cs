using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Interfaces;
using EmployeeManagementSystem.Models;
using MailKit.Security;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using System.Net.Mail;

namespace EmployeeManagementSystem.Services

{

    public class EmailService : IEmailService

    {

        private readonly AppDbContext _context;

        public EmailService(AppDbContext context)

        {

            _context = context;

        }

        private static string? GetEnvValue(params string[] names)
        {
            foreach (var name in names)
            {
                var value = Environment.GetEnvironmentVariable(name);
                if (!string.IsNullOrWhiteSpace(value))
                {
                    return value.Trim();
                }
            }

            return null;
        }

        private EmailSettings GetEmailSettings()

        {

            var settings = _context.EmailSettings.AsNoTracking().FirstOrDefault()
                ?? new EmailSettings();

            var senderEmail = GetEnvValue("SMTP_USERNAME", "SMTP_SENDER_EMAIL");
            var senderPassword = GetEnvValue("SMTP_PASSWORD", "SMTP_SENDER_PASSWORD");
            var smtpHost = GetEnvValue("SMTP_HOST");
            var smtpPort = GetEnvValue("SMTP_PORT");
            var enableSsl = GetEnvValue("SMTP_ENABLE_SSL", "SMTP_SSL", "SMTP_SECURITY");
            var displayName = GetEnvValue("SMTP_DISPLAY_NAME");

            if (!string.IsNullOrWhiteSpace(senderEmail))
            {
                settings.SenderEmail = senderEmail;
            }

            if (!string.IsNullOrWhiteSpace(senderPassword))
            {
                settings.SenderPassword = senderPassword;
            }

            if (!string.IsNullOrWhiteSpace(smtpHost))
            {
                settings.SmtpHost = smtpHost;
            }

            if (int.TryParse(smtpPort, out var parsedPort))
            {
                settings.SmtpPort = parsedPort;
            }

            if (!string.IsNullOrWhiteSpace(enableSsl))
            {
                settings.EnableSSL =
                    enableSsl.Equals("true", StringComparison.OrdinalIgnoreCase) ||
                    enableSsl.Equals("1", StringComparison.OrdinalIgnoreCase) ||
                    enableSsl.Contains("SSL", StringComparison.OrdinalIgnoreCase) ||
                    enableSsl.Contains("TLS", StringComparison.OrdinalIgnoreCase);
            }

            if (!string.IsNullOrWhiteSpace(displayName))
            {
                settings.DisplayName = displayName;
            }

            if (string.IsNullOrWhiteSpace(settings.SenderEmail) ||
                string.IsNullOrWhiteSpace(settings.SenderPassword) ||
                string.IsNullOrWhiteSpace(settings.SmtpHost) ||
                settings.SmtpPort <= 0)
            {
                throw new Exception("Email Settings not configured.");
            }

            if (string.IsNullOrWhiteSpace(settings.DisplayName))
            {
                settings.DisplayName = settings.SenderEmail;
            }

            return settings;

        }

        private static SecureSocketOptions GetSecureSocketOptions(EmailSettings settings)
        {
            if (!settings.EnableSSL)
            {
                return SecureSocketOptions.None;
            }

            return settings.SmtpPort == 465
                ? SecureSocketOptions.SslOnConnect
                : SecureSocketOptions.StartTls;
        }

        private static MimeMessage ToMimeMessage(MailMessage message)
        {
            var mimeMessage = new MimeMessage();

            if (message.From == null)
            {
                throw new InvalidOperationException("Sender email is required.");
            }

            mimeMessage.From.Add(new MailboxAddress(
                message.From.DisplayName,
                message.From.Address));

            foreach (var address in message.To)
            {
                mimeMessage.To.Add(new MailboxAddress(address.DisplayName, address.Address));
            }

            foreach (var address in message.CC)
            {
                mimeMessage.Cc.Add(new MailboxAddress(address.DisplayName, address.Address));
            }

            foreach (var address in message.Bcc)
            {
                mimeMessage.Bcc.Add(new MailboxAddress(address.DisplayName, address.Address));
            }

            mimeMessage.Subject = message.Subject;

            var bodyBuilder = new BodyBuilder();
            if (message.IsBodyHtml)
            {
                bodyBuilder.HtmlBody = message.Body;
            }
            else
            {
                bodyBuilder.TextBody = message.Body;
            }

            foreach (var attachment in message.Attachments)
            {
                if (attachment.ContentStream.CanSeek)
                {
                    attachment.ContentStream.Position = 0;
                }

                bodyBuilder.Attachments.Add(
                    attachment.Name,
                    attachment.ContentStream,
                    MimeKit.ContentType.Parse(attachment.ContentType.ToString()));
            }

            mimeMessage.Body = bodyBuilder.ToMessageBody();
            return mimeMessage;
        }

        private static async Task SendMailMessageAsync(
            EmailSettings settings,
            MailMessage message)
        {
            using var smtp = new MailKit.Net.Smtp.SmtpClient();

            smtp.Timeout = 60000;

            await smtp.ConnectAsync(
                settings.SmtpHost,
                settings.SmtpPort,
                GetSecureSocketOptions(settings));

            await smtp.AuthenticateAsync(
                settings.SenderEmail,
                settings.SenderPassword);

            await smtp.SendAsync(ToMimeMessage(message));
            await smtp.DisconnectAsync(true);
        }

        // ✅ Existing OTP Method (Keep Working)

        public async Task SendOtpAsync(string toEmail, string otp)
        {
            var settings = GetEmailSettings();

            try
            {
                using var message = new MailMessage();

                message.From = new MailAddress(
                    settings.SenderEmail,
                    settings.DisplayName);

                message.To.Add(toEmail);

                message.Subject = "Password Reset OTP";

                message.Body = $@"
Hello,

Your OTP for resetting your EMS password is:

{otp}

This OTP is confidential. Please do not share it with anyone.

Regards,
Honeywell EMS Team";

                message.IsBodyHtml = false;

                await SendMailMessageAsync(settings, message);
            }
            catch (Exception ex)
            {
                Console.WriteLine("SMTP ERROR");
                Console.WriteLine($"Message: {ex.Message}");
                Console.WriteLine($"Inner: {ex.InnerException?.Message}");

                throw;
            }
        } // ✅ New Method For Offer Letter Attachment

        public async Task SendEmailWithAttachment(

            string toEmail,

            string subject,

            string body,

            string attachmentPath)

        {

            var settings = GetEmailSettings();

            using var message = new MailMessage();

            message.From = new MailAddress(

    settings.SenderEmail,

    settings.DisplayName);

            message.To.Add(toEmail);

            message.Subject = subject;

            message.Body = body;

            message.IsBodyHtml = false;

            if (File.Exists(attachmentPath))

            {

                message.Attachments.Add(new Attachment(attachmentPath));

            }

            await SendMailMessageAsync(settings, message);

        }

        public async Task SendEmployeeCredentials(string toEmail, string employeeName)
        {
            var settings = GetEmailSettings();

            try
            {
                using var message = new MailMessage();

                message.From = new MailAddress(
                    settings.SenderEmail,
                    settings.DisplayName);

                message.To.Add(toEmail);

                message.Subject = "EMS Login Details";

                message.Body = $@"
Hello {employeeName},

Your account has been created successfully in Honeywell EMS.

Login URL:
https://hrms.honeywellitsolutions.com/register

Please register and verify your account before logging in.

Regards,
Honeywell HR Team";

                message.IsBodyHtml = false;

                await SendMailMessageAsync(settings, message);
            }
            catch (Exception ex)
            {
                Console.WriteLine("SMTP ERROR");
                Console.WriteLine($"Message: {ex.Message}");
                Console.WriteLine($"Inner Exception: {ex.InnerException?.Message}");

                throw new Exception($"Failed to send email: {ex.Message}");
            }
        }

        public async Task SendEmailAsync(

    string toEmail,

    string subject,

    string body)

        {

            var settings = GetEmailSettings();

            using var message = new MailMessage();

            message.From = new MailAddress(

    settings.SenderEmail,

    settings.DisplayName);

            message.To.Add(toEmail);

            message.Subject = subject;

            message.Body = body;

            message.IsBodyHtml = true;

            await SendMailMessageAsync(settings, message);

        }

        public async Task SendPayslipEmail(
    string toEmail,
    string employeeName,
    string month,
    int year,
    string attachmentPath)
        {
            var settings = GetEmailSettings();

            using var message = new MailMessage();

            message.From = new MailAddress(
                settings.SenderEmail,
                settings.DisplayName);

            message.To.Add(toEmail);

            message.Subject = $"Salary Payslip - {month} {year}";

            message.IsBodyHtml = true;

            message.Body = $@"
<html>
<body style='font-family:Segoe UI,Arial,sans-serif;'>

<p>Dear <b>{employeeName}</b>,</p>

<p>
Please find attached your salary payslip for
<b>{month} {year}</b>.
</p>

<p>
Kindly review the attached payslip.
For any clarification, please contact the HR Department.
</p>

<br/>

<p>
Regards,<br/>
<b>HR Team</b><br/>
Honeywell IT Solutions Pvt. Ltd.
</p>

<hr/>

<p style='font-size:12px;color:gray'>
This is a system generated email. Please do not reply.
</p>

</body>
</html>";

            if (!File.Exists(attachmentPath))
                throw new Exception($"Payslip not found: {attachmentPath}");

            message.Attachments.Add(new Attachment(attachmentPath));

            await SendMailMessageAsync(settings, message);
        }
        public async Task SendLocationMismatchEmail(

    string adminEmail,

    string employeeId,

    string employeeName,

    string employeeEmail,

    decimal checkInLatitude,

    decimal checkInLongitude,

    decimal checkOutLatitude,

    decimal checkOutLongitude,

    decimal distance,

    string reason)

        {

            var settings = GetEmailSettings();

            using var message = new MailMessage();

            message.From = new MailAddress(

    settings.SenderEmail,

    settings.DisplayName);

            message.To.Add(adminEmail);

            message.Subject =

     $"Location Mismatch Alert | {employeeId} - {employeeName}";

            message.Body =

$@"Employee Location Change Alert
 
Employee ID:

{employeeId}
 
Employee Name:

{employeeName}
 
Employee Email:

{employeeEmail}
 
--------------------------------
 
Check-In Location
 
Latitude:

{checkInLatitude}
 
Longitude:

{checkInLongitude}
 
--------------------------------
 
Check-Out Location
 
Latitude:

{checkOutLatitude}
 
Longitude:

{checkOutLongitude}
 
--------------------------------
 
Distance:

{Math.Round(distance, 2)} KM
 
--------------------------------
 
Reason Entered By Employee:
 
{reason}
 
--------------------------------
 
Generated By EMS Attendance System";

            await SendMailMessageAsync(settings, message);

        }

    }

}
 
