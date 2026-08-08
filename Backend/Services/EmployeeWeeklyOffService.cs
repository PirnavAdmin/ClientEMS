using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Interfaces;
using EmployeeManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Services
{
    public class EmployeeWeeklyOffService : IEmployeeWeeklyOffService
    {
        private readonly AppDbContext _context;

        public EmployeeWeeklyOffService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EmployeeWeeklyOff>> GetAllAsync()
        {
            return await _context.EmployeeWeeklyOffs
                .OrderByDescending(x => x.CreatedDate)
                .ToListAsync();
        }

        public async Task<EmployeeWeeklyOff?> GetByIdAsync(int id)
        {
            return await _context.EmployeeWeeklyOffs
                .FirstOrDefaultAsync(x => x.WeeklyOffId == id);
        }

        public async Task<bool> CreateAsync(CreateEmployeeWeeklyOffDto dto)
        {
            var exists = await _context.EmployeeWeeklyOffs.AnyAsync(x =>
                x.Employee_Id == dto.Employee_Id &&
                x.DayName == dto.DayName &&
                x.IsActive);

            if (exists)
                return false;

            var weeklyOff = new EmployeeWeeklyOff
            {
                Employee_Id = dto.Employee_Id,
                DayName = dto.DayName,
                EffectiveFrom = dto.EffectiveFrom,
                EffectiveTo = dto.EffectiveTo,
                IsActive = true,
                CreatedDate = DateTime.Now
            };

            _context.EmployeeWeeklyOffs.Add(weeklyOff);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateAsync(int id, UpdateEmployeeWeeklyOffDto dto)
        {
            var weeklyOff = await _context.EmployeeWeeklyOffs
                .FirstOrDefaultAsync(x => x.WeeklyOffId == id);

            if (weeklyOff == null)
                return false;

            weeklyOff.DayName = dto.DayName;
            weeklyOff.EffectiveFrom = dto.EffectiveFrom;
            weeklyOff.EffectiveTo = dto.EffectiveTo;
            weeklyOff.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var weeklyOff = await _context.EmployeeWeeklyOffs
                .FirstOrDefaultAsync(x => x.WeeklyOffId == id);

            if (weeklyOff == null)
                return false;

            _context.EmployeeWeeklyOffs.Remove(weeklyOff);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}