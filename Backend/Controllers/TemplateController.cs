using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TemplateController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TemplateController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTemplates()
        {
            return Ok(await _context.TemplateMaster
                .OrderByDescending(x => x.TemplateId)
                .ToListAsync());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTemplate(int id)
        {
            var template = await _context.TemplateMaster.FindAsync(id);

            if (template == null)
                return NotFound();

            _context.TemplateMaster.Remove(template);

            await _context.SaveChangesAsync();

            return Ok("Deleted Successfully");
        }

        [HttpPost]
        [HttpPost]
        public async Task<IActionResult> UploadTemplate(
    IFormFile file,
    string templateName,
    string templateCode,
    string category,
    string version,
    int companyId)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Please select a template file.");

            var uploadFolder = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "uploads",
                "templates");

            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var template = new TemplateMaster
            {
                Company_Id = companyId,
                TemplateName = templateName,
                TemplateCode = templateCode,
                TemplateCategory = category,
                FileName = file.FileName,
                FilePath = "/uploads/templates/" + fileName,
                Version = version,
                IsActive = true,
                IsDefault = false,
                CreatedBy = "Admin",
                CreatedDate = DateTime.Now
            };

            _context.TemplateMaster.Add(template);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Template uploaded successfully.",
                TemplateId = template.TemplateId,
                TemplatePath = template.FilePath
            });
        }

        [HttpGet("download/{id}")]
        public async Task<IActionResult> DownloadTemplate(int id)
        {
            var template = await _context.TemplateMaster.FindAsync(id);

            if (template == null)
                return NotFound();

            var path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                template.FilePath.TrimStart('/'));

            if (!System.IO.File.Exists(path))
                return NotFound("File not found.");

            return PhysicalFile(
                path,
                "application/octet-stream",
                template.FileName);
        }
    }
}