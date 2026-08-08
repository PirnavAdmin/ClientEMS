using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Interfaces;
using EmployeeManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Services
{
    public class ShiftService : IShiftService
    {
        private readonly AppDbContext _context;

        public ShiftService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ShiftResponseDto>> GetAllAsync()
        {
            return await _context.ShiftMasters
                .OrderBy(x => x.ShiftName)
                .Select(x => new ShiftResponseDto
                {
                    ShiftId = x.ShiftId,
                    ShiftCode = x.ShiftCode,
                    ShiftName = x.ShiftName,
                    StartTime = x.StartTime,
                    EndTime = x.EndTime,
                    BreakStart = x.BreakStart,
                    BreakEnd = x.BreakEnd,
                    GraceTimeMinutes = x.GraceTimeMinutes,
                    HalfDayHours = x.HalfDayHours,
                    FullDayHours = x.FullDayHours,
                    WeeklyOff = x.WeeklyOff,
                    IsNightShift = x.IsNightShift,
                    IsActive = x.IsActive,
                    CreatedDate = x.CreatedDate
                })
                .ToListAsync();
        }

        public async Task<ShiftResponseDto?> GetByIdAsync(int shiftId)
        {
            var shift = await _context.ShiftMasters
                .FirstOrDefaultAsync(x => x.ShiftId == shiftId);

            if (shift == null)
                return null;

            return new ShiftResponseDto
            {
                ShiftId = shift.ShiftId,
                ShiftCode = shift.ShiftCode,
                ShiftName = shift.ShiftName,
                StartTime = shift.StartTime,
                EndTime = shift.EndTime,
                BreakStart = shift.BreakStart,
                BreakEnd = shift.BreakEnd,
                GraceTimeMinutes = shift.GraceTimeMinutes,
                HalfDayHours = shift.HalfDayHours,
                FullDayHours = shift.FullDayHours,
                WeeklyOff = shift.WeeklyOff,
                IsNightShift = shift.IsNightShift,
                IsActive = shift.IsActive,
                CreatedDate = shift.CreatedDate
            };
        }

        public async Task<string> CreateAsync(CreateShiftDto dto)
        {
            if (await _context.ShiftMasters.AnyAsync(x => x.ShiftCode == dto.ShiftCode))
                return "Shift Code already exists.";

            var shift = new ShiftMaster
            {
                ShiftCode = dto.ShiftCode,
                ShiftName = dto.ShiftName,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                BreakStart = dto.BreakStart,
                BreakEnd = dto.BreakEnd,
                GraceTimeMinutes = dto.GraceTimeMinutes,
                HalfDayHours = dto.HalfDayHours,
                FullDayHours = dto.FullDayHours,
                WeeklyOff = dto.WeeklyOff,
                IsNightShift = dto.IsNightShift,
                IsActive = dto.IsActive,
                CreatedDate = DateTime.Now
            };

            _context.ShiftMasters.Add(shift);
            await _context.SaveChangesAsync();

            return "Shift created successfully.";
        }

        public async Task<string> UpdateAsync(UpdateShiftDto dto)
        {
            var shift = await _context.ShiftMasters.FindAsync(dto.ShiftId);

            if (shift == null)
                return "Shift not found.";

            if (await _context.ShiftMasters.AnyAsync(x => x.ShiftCode == dto.ShiftCode && x.ShiftId != dto.ShiftId))
                return "Shift Code already exists.";

            shift.ShiftCode = dto.ShiftCode;
            shift.ShiftName = dto.ShiftName;
            shift.StartTime = dto.StartTime;
            shift.EndTime = dto.EndTime;
            shift.BreakStart = dto.BreakStart;
            shift.BreakEnd = dto.BreakEnd;
            shift.GraceTimeMinutes = dto.GraceTimeMinutes;
            shift.HalfDayHours = dto.HalfDayHours;
            shift.FullDayHours = dto.FullDayHours;
            shift.WeeklyOff = dto.WeeklyOff;
            shift.IsNightShift = dto.IsNightShift;
            shift.IsActive = dto.IsActive;
            shift.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return "Shift updated successfully.";
        }

        public async Task<string> DeleteAsync(int shiftId)
        {
            var shift = await _context.ShiftMasters.FindAsync(shiftId);

            if (shift == null)
                return "Shift not found.";

            _context.ShiftMasters.Remove(shift);

            await _context.SaveChangesAsync();

            return "Shift deleted successfully.";
        }
    }
}