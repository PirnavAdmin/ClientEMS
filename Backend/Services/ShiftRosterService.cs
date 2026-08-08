using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Interfaces;
using Microsoft.EntityFrameworkCore;
using EmployeeManagementSystem.Models;

namespace EmployeeManagementSystem.Services
{
    public class ShiftRosterService : IShiftRosterService
    {
        private readonly AppDbContext _context;

        public ShiftRosterService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CreateAsync(CreateShiftRosterDto dto)
        {
            var exists = await _context.ShiftRosters.AnyAsync(x =>
                x.Employee_Id == dto.Employee_Id &&
                x.RosterDate.Date == dto.RosterDate.Date);

            if (exists)
                return false;

            var roster = new ShiftRoster
            {
                Employee_Id = dto.Employee_Id,
                ShiftId = dto.ShiftId,
                RosterDate = dto.RosterDate,
                Remarks = dto.Remarks,
                IsPublished = dto.IsPublished,
                CreatedDate = DateTime.Now
            };

            _context.ShiftRosters.Add(roster);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var roster = await _context.ShiftRosters.FindAsync(id);

            if (roster == null)
                return false;

            _context.ShiftRosters.Remove(roster);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<ShiftRosterResponseDto>> GetAllAsync()
        {
            return await _context.ShiftRosters
                .Select(x => new ShiftRosterResponseDto
                {
                    RosterId = x.RosterId,
                    Employee_Id = x.Employee_Id,
                    ShiftId = x.ShiftId,
                    RosterDate = x.RosterDate,
                    Remarks = x.Remarks,
                    IsPublished = x.IsPublished
                })
                .ToListAsync();
        }

        public async Task<ShiftRosterResponseDto?> GetByIdAsync(int id)
        {
            return await _context.ShiftRosters
                .Where(x => x.RosterId == id)
                .Select(x => new ShiftRosterResponseDto
                {
                    RosterId = x.RosterId,
                    Employee_Id = x.Employee_Id,
                    ShiftId = x.ShiftId,
                    RosterDate = x.RosterDate,
                    Remarks = x.Remarks,
                    IsPublished = x.IsPublished
                })
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<ShiftRosterResponseDto>> GetEmployeeRosterAsync(string employeeId)
        {
            return await _context.ShiftRosters
                .Where(x => x.Employee_Id == employeeId)
                .OrderBy(x => x.RosterDate)
                .Select(x => new ShiftRosterResponseDto
                {
                    RosterId = x.RosterId,
                    Employee_Id = x.Employee_Id,
                    ShiftId = x.ShiftId,
                    RosterDate = x.RosterDate,
                    Remarks = x.Remarks,
                    IsPublished = x.IsPublished
                })
                .ToListAsync();
        }

        public async Task<bool> UpdateAsync(int id, UpdateShiftRosterDto dto)
        {
            var roster = await _context.ShiftRosters.FindAsync(id);

            if (roster == null)
                return false;

            roster.ShiftId = dto.ShiftId;
            roster.RosterDate = dto.RosterDate;
            roster.Remarks = dto.Remarks;
            roster.IsPublished = dto.IsPublished;
            roster.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> BulkAssignAsync(BulkShiftRosterDto dto)
        {
            foreach (var emp in dto.EmployeeIds)
            {
                for (var date = dto.FromDate.Date; date <= dto.ToDate.Date; date = date.AddDays(1))
                {
                    bool exists = await _context.ShiftRosters.AnyAsync(x =>
                        x.Employee_Id == emp &&
                        x.RosterDate == date);

                    if (!exists)
                    {
                        _context.ShiftRosters.Add(new ShiftRoster
                        {
                            Employee_Id = emp,
                            ShiftId = dto.ShiftId,
                            RosterDate = date,
                            Remarks = dto.Remarks,
                            IsPublished = true,
                            CreatedDate = DateTime.Now
                        });
                    }
                }
            }

            await _context.SaveChangesAsync();

            return true;
        }
    }
}