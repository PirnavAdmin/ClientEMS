using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Interfaces;
using EmployeeManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Services
{
    public class ShiftSwapService : IShiftSwapService
    {
        private readonly AppDbContext _context;

        public ShiftSwapService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ShiftSwap>> GetAllAsync()
        {
            return await _context.ShiftSwaps
                .OrderByDescending(x => x.CreatedDate)
                .ToListAsync();
        }

        public async Task<ShiftSwap?> GetByIdAsync(int id)
        {
            return await _context.ShiftSwaps.FindAsync(id);
        }

        public async Task<bool> RequestSwapAsync(CreateShiftSwapDto dto)
        {
            bool exists = await _context.ShiftSwaps.AnyAsync(x =>
                x.FromEmployeeId == dto.FromEmployeeId &&
                x.ShiftDate.Date == dto.ShiftDate.Date &&
                x.Status == "Pending");

            if (exists)
                return false;

            var swap = new ShiftSwap
            {
                FromEmployeeId = dto.FromEmployeeId,
                ToEmployeeId = dto.ToEmployeeId,
                ShiftDate = dto.ShiftDate,
                ShiftId = dto.ShiftId,
                Reason = dto.Reason,
                Status = "Pending",
                CreatedDate = DateTime.Now
            };

            _context.ShiftSwaps.Add(swap);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ApproveSwapAsync(ApproveShiftSwapDto dto)
        {
            var swap = await _context.ShiftSwaps.FindAsync(dto.SwapId);

            if (swap == null)
                return false;

            swap.Status = dto.Approve ? "Approved" : "Rejected";
            swap.ApprovedBy = dto.ApprovedBy;
            swap.ApprovedDate = DateTime.Now;

            if (dto.Approve)
            {
                var emp1 = await _context.ShiftRosters.FirstOrDefaultAsync(x =>
                    x.Employee_Id == swap.FromEmployeeId &&
                    x.RosterDate.Date == swap.ShiftDate.Date);

                var emp2 = await _context.ShiftRosters.FirstOrDefaultAsync(x =>
                    x.Employee_Id == swap.ToEmployeeId &&
                    x.RosterDate.Date == swap.ShiftDate.Date);

                if (emp1 != null && emp2 != null)
                {
                    int temp = emp1.ShiftId;
                    emp1.ShiftId = emp2.ShiftId;
                    emp2.ShiftId = temp;
                }
            }

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var swap = await _context.ShiftSwaps.FindAsync(id);

            if (swap == null)
                return false;

            _context.ShiftSwaps.Remove(swap);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}