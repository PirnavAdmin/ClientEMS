using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Interfaces;
using EmployeeManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Services
{
    public class ShiftChangeRequestService : IShiftChangeRequestService
    {
        private readonly AppDbContext _context;

        public ShiftChangeRequestService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ShiftChangeRequest>> GetAllAsync()
        {
            return await _context.ShiftChangeRequests
                .OrderByDescending(x => x.CreatedDate)
                .ToListAsync();
        }

        public async Task<ShiftChangeRequest?> GetByIdAsync(int id)
        {
            return await _context.ShiftChangeRequests.FindAsync(id);
        }

        public async Task<bool> CreateAsync(CreateShiftChangeRequestDto dto)
        {
            bool exists = await _context.ShiftChangeRequests.AnyAsync(x =>
                x.Employee_Id == dto.Employee_Id &&
                x.Status == "Pending");

            if (exists)
                return false;

            var request = new ShiftChangeRequest
            {
                Employee_Id = dto.Employee_Id,
                CurrentShiftId = dto.CurrentShiftId,
                RequestedShiftId = dto.RequestedShiftId,
                EffectiveFrom = dto.EffectiveFrom,
                EffectiveTo = dto.EffectiveTo,
                IsPermanent = dto.IsPermanent,
                Reason = dto.Reason,
                Status = "Pending",
                CreatedDate = DateTime.Now
            };

            _context.ShiftChangeRequests.Add(request);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ApproveAsync(ApproveShiftChangeRequestDto dto)
        {
            var request = await _context.ShiftChangeRequests.FindAsync(dto.RequestId);

            if (request == null)
                return false;

            request.Status = dto.Approve ? "Approved" : "Rejected";
            request.ApprovedBy = dto.ApprovedBy;
            request.ApprovedDate = DateTime.Now;

            if (dto.Approve)
            {
                if (request.IsPermanent)
                {
                    var assignment = await _context.EmployeeShiftAssignments
                        .FirstOrDefaultAsync(x => x.Employee_Id == request.Employee_Id && x.IsActive);

                    if (assignment != null)
                    {
                        assignment.ShiftId = request.RequestedShiftId;
                        assignment.UpdatedDate = DateTime.Now;
                    }
                }
                else
                {
                    var date = request.EffectiveFrom.Date;
                    var endDate = request.EffectiveTo?.Date ?? date;

                    while (date <= endDate)
                    {
                        var roster = await _context.ShiftRosters
                            .FirstOrDefaultAsync(x =>
                                x.Employee_Id == request.Employee_Id &&
                                x.RosterDate.Date == date);

                        if (roster != null)
                        {
                            roster.ShiftId = request.RequestedShiftId;
                            roster.UpdatedDate = DateTime.Now;
                        }
                        else
                        {
                            _context.ShiftRosters.Add(new ShiftRoster
                            {
                                Employee_Id = request.Employee_Id,
                                ShiftId = request.RequestedShiftId,
                                RosterDate = date,
                                IsPublished = true,
                                CreatedDate = DateTime.Now
                            });
                        }

                        date = date.AddDays(1);
                    }
                }
            }

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var request = await _context.ShiftChangeRequests.FindAsync(id);

            if (request == null)
                return false;

            _context.ShiftChangeRequests.Remove(request);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}