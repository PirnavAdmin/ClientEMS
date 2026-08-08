using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementSystem.DTOs;

public class UpdateShiftDto
{
    [Required]
    public int ShiftId { get; set; }

    [Required]
    public string ShiftCode { get; set; } = string.Empty;

    [Required]
    public string ShiftName { get; set; } = string.Empty;

    [Required]
    public TimeSpan StartTime { get; set; }

    [Required]
    public TimeSpan EndTime { get; set; }

    public TimeSpan? BreakStart { get; set; }

    public TimeSpan? BreakEnd { get; set; }

    public int GraceTimeMinutes { get; set; }

    public decimal HalfDayHours { get; set; }

    public decimal FullDayHours { get; set; }

    public string? WeeklyOff { get; set; }

    public bool IsNightShift { get; set; }

    public bool IsActive { get; set; }
}