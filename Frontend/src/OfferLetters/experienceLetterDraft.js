export const buildExperienceLetterEmailDraft = (experienceLetter) => {
  const employeeName = String(
    experienceLetter?.employeeName ||
      experienceLetter?.employee_Name ||
      experienceLetter?.employee_name ||
      experienceLetter?.name ||
      "Employee"
  ).trim();

  return {
    subject: `Experience Letter - ${employeeName}`,
    body: [
      "Dear Employee,",
      "",
      "Please find attached your Experience Letter.",
      "",
      "Thank you for your contribution to the organization.",
      "",
      "We wish you all the best.",
      "",
      "Regards,",
      "HR Team",
    ].join("\n"),
  };
};
