using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Interfaces;
using EmployeeManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Services
{
    public class ShiftRotationService : IShiftRotationService
    {
        private readonly AppDbContext _context;

        public ShiftRotationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ShiftRotation>> GetAllAsync()
        {
            return await _context.ShiftRotations
                .OrderByDescending(x => x.CreatedDate)
                .ToListAsync();
        }

        public async Task<ShiftRotation?> GetByIdAsync(int id)
        {
            return await _context.ShiftRotations
                .FirstOrDefaultAsync(x => x.RotationId == id);
        }

        public async Task<bool> CreateAsync(CreateShiftRotationDto dto)
        {
            var exists = await _context.ShiftRotations.AnyAsync(x =>
                x.Employee_Id == dto.Employee_Id &&
                x.IsActive);

            if (exists)
                return false;

            var rotation = new ShiftRotation
            {
                Employee_Id = dto.Employee_Id,
                RotationType = dto.RotationType,
                Shift1Id = dto.Shift1Id,
                Shift2Id = dto.Shift2Id,
                Shift3Id = dto.Shift3Id,
                EffectiveFrom = dto.EffectiveFrom,
                IsActive = true,
                CreatedDate = DateTime.Now
            };

            _context.ShiftRotations.Add(rotation);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateAsync(int id, UpdateShiftRotationDto dto)
        {
            var rotation = await _context.ShiftRotations
                .FirstOrDefaultAsync(x => x.RotationId == id);

            if (rotation == null)
                return false;

            rotation.RotationType = dto.RotationType;
            rotation.Shift1Id = dto.Shift1Id;
            rotation.Shift2Id = dto.Shift2Id;
            rotation.Shift3Id = dto.Shift3Id;
            rotation.EffectiveFrom = dto.EffectiveFrom;
            rotation.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var rotation = await _context.ShiftRotations
                .FirstOrDefaultAsync(x => x.RotationId == id);

            if (rotation == null)
                return false;

            _context.ShiftRotations.Remove(rotation);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}