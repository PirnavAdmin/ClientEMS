using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Interfaces;
using EmployeeManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Services
{
    public class EmployeeShiftService : IEmployeeShiftService
    {
        private readonly AppDbContext _context;

        public EmployeeShiftService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<string> AssignShiftAsync(AssignShiftDto dto)
        {
            var employeeExists = await _context.Employees
                .AnyAsync(x => x.Employee_Id == dto.Employee_Id);

            if (!employeeExists)
                return "Employee not found.";

            var shift = await _context.ShiftMasters.FindAsync(dto.ShiftId);

            if (shift == null)
                return "Shift not found.";

            var currentAssignments = await _context.EmployeeShiftAssignments
                .Where(x => x.Employee_Id == dto.Employee_Id && x.IsActive)
                .ToListAsync();

            foreach (var item in currentAssignments)
            {
                item.IsActive = false;
                item.EffectiveTo = dto.EffectiveFrom.AddDays(-1);
                item.UpdatedDate = DateTime.Now;
            }

            var assignment = new EmployeeShiftAssignment
            {
                Employee_Id = dto.Employee_Id,
                ShiftId = dto.ShiftId,
                EffectiveFrom = dto.EffectiveFrom,
                EffectiveTo = dto.EffectiveTo,
                IsActive = true,
                CreatedDate = DateTime.Now
            };

            _context.EmployeeShiftAssignments.Add(assignment);

            await _context.SaveChangesAsync();

            return "Shift assigned successfully.";
        }

        public async Task<string> BulkAssignShiftAsync(List<AssignShiftDto> dto)
        {
            foreach (var item in dto)
            {
                await AssignShiftAsync(item);
            }

            return "Bulk shift assignment completed.";
        }

        public async Task<IEnumerable<EmployeeShiftResponseDto>> GetAllAssignmentsAsync()
        {
            return await _context.EmployeeShiftAssignments
                .Include(x => x.Shift)
                .Where(x => x.IsActive)
                .Select(x => new EmployeeShiftResponseDto
                {
                    AssignmentId = x.AssignmentId,
                    Employee_Id = x.Employee_Id,
                    ShiftId = x.ShiftId,
                    ShiftName = x.Shift!.ShiftName,
                    ShiftCode = x.Shift.ShiftCode,
                    StartTime = x.Shift.StartTime,
                    EndTime = x.Shift.EndTime,
                    EffectiveFrom = x.EffectiveFrom,
                    EffectiveTo = x.EffectiveTo,
                    IsActive = x.IsActive
                })
                .ToListAsync();
        }

        public async Task<EmployeeShiftResponseDto?> GetEmployeeShiftAsync(string employeeId)
        {
            return await _context.EmployeeShiftAssignments
                .Include(x => x.Shift)
                .Where(x => x.Employee_Id == employeeId && x.IsActive)
                .Select(x => new EmployeeShiftResponseDto
                {
                    AssignmentId = x.AssignmentId,
                    Employee_Id = x.Employee_Id,
                    ShiftId = x.ShiftId,
                    ShiftName = x.Shift!.ShiftName,
                    ShiftCode = x.Shift.ShiftCode,
                    StartTime = x.Shift.StartTime,
                    EndTime = x.Shift.EndTime,
                    EffectiveFrom = x.EffectiveFrom,
                    EffectiveTo = x.EffectiveTo,
                    IsActive = x.IsActive
                })
                .FirstOrDefaultAsync();
        }

        public async Task<string> RemoveAssignmentAsync(int assignmentId)
        {
            var assignment = await _context.EmployeeShiftAssignments
                .FirstOrDefaultAsync(x => x.AssignmentId == assignmentId);

            if (assignment == null)
                return "Assignment not found.";

            assignment.IsActive = false;
            assignment.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return "Assignment removed successfully.";
        }
    }
}