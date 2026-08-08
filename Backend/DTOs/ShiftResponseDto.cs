namespace EmployeeManagementSystem.DTOs;

public class ShiftResponseDto
{
    public int ShiftId { get; set; }

    public string ShiftCode { get; set; } = string.Empty;

    public string ShiftName { get; set; } = string.Empty;

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }

    public TimeSpan? BreakStart { get; set; }

    public TimeSpan? BreakEnd { get; set; }

    public int GraceTimeMinutes { get; set; }

    public decimal HalfDayHours { get; set; }

    public decimal FullDayHours { get; set; }

    public string? WeeklyOff { get; set; }

    public bool IsNightShift { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedDate { get; set; }
}