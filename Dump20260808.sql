-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: ems
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `__efmigrationshistory`
--

DROP TABLE IF EXISTS `__efmigrationshistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `activitylogs`
--

DROP TABLE IF EXISTS `activitylogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activitylogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Activity` text,
  `CreatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=980 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `adminnotifications`
--

DROP TABLE IF EXISTS `adminnotifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adminnotifications` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` text NOT NULL,
  `Message` text NOT NULL,
  `UserRole` varchar(50) DEFAULT NULL,
  `IsRead` tinyint(1) DEFAULT '0',
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `adminpermissions`
--

DROP TABLE IF EXISTS `adminpermissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adminpermissions` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `AdminId` int NOT NULL,
  `ModuleId` int NOT NULL,
  `CanView` bit(1) DEFAULT b'0',
  `CanAdd` bit(1) DEFAULT b'0',
  `CanEdit` bit(1) DEFAULT b'0',
  `CanDelete` bit(1) DEFAULT b'0',
  `CanAccess` bit(1) DEFAULT b'0',
  PRIMARY KEY (`Id`),
  KEY `AdminId` (`AdminId`),
  KEY `ModuleId` (`ModuleId`),
  CONSTRAINT `adminpermissions_ibfk_1` FOREIGN KEY (`AdminId`) REFERENCES `admins` (`id`),
  CONSTRAINT `adminpermissions_ibfk_2` FOREIGN KEY (`ModuleId`) REFERENCES `modules` (`ModuleId`)
) ENGINE=InnoDB AUTO_INCREMENT=1010 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Email` text,
  `Password` text,
  `IsActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `adminsubscriptions`
--

DROP TABLE IF EXISTS `adminsubscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adminsubscriptions` (
  `SubscriptionId` int NOT NULL AUTO_INCREMENT,
  `AdminId` int NOT NULL,
  `MaxUsers` int NOT NULL,
  `StartDate` datetime NOT NULL,
  `EndDate` datetime NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT '1',
  `CreatedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`SubscriptionId`),
  KEY `AdminId` (`AdminId`),
  CONSTRAINT `adminsubscriptions_ibfk_1` FOREIGN KEY (`AdminId`) REFERENCES `admins` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `agreementmaster`
--

DROP TABLE IF EXISTS `agreementmaster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agreementmaster` (
  `AgreementId` int NOT NULL AUTO_INCREMENT,
  `AgreementCode` varchar(50) NOT NULL,
  `AgreementName` varchar(200) NOT NULL,
  `Description` text,
  `FileName` varchar(255) NOT NULL,
  `FilePath` varchar(500) NOT NULL,
  `Version` varchar(20) NOT NULL DEFAULT '1.0',
  `IsMandatory` bit(1) NOT NULL DEFAULT b'1',
  `AssignToExistingEmployees` bit(1) NOT NULL DEFAULT b'0',
  `IsActive` bit(1) NOT NULL DEFAULT b'1',
  `CreatedBy` varchar(100) DEFAULT NULL,
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `ModifiedBy` varchar(100) DEFAULT NULL,
  `ModifiedDate` datetime DEFAULT NULL,
  `PdfPath` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`AgreementId`),
  UNIQUE KEY `AgreementCode` (`AgreementCode`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `appraisal`
--

DROP TABLE IF EXISTS `appraisal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appraisal` (
  `AppraisalId` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(20) DEFAULT NULL,
  `PerformanceCycleId` int DEFAULT NULL,
  `SelfRating` int DEFAULT NULL,
  `ManagerRating` int DEFAULT NULL,
  `FinalRating` int DEFAULT NULL,
  `ManagerRemarks` text,
  `HRRemarks` text,
  `PromotionRecommended` bit(1) DEFAULT NULL,
  `SalaryHikePercentage` decimal(5,2) DEFAULT NULL,
  `Status` varchar(30) DEFAULT NULL,
  `ReviewedOn` datetime DEFAULT NULL,
  PRIMARY KEY (`AppraisalId`),
  KEY `PerformanceCycleId` (`PerformanceCycleId`),
  CONSTRAINT `appraisal_ibfk_1` FOREIGN KEY (`PerformanceCycleId`) REFERENCES `performancecycle` (`PerformanceCycleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `appraisalletter`
--

DROP TABLE IF EXISTS `appraisalletter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appraisalletter` (
  `AppraisalLetterId` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(20) DEFAULT NULL,
  `AppraisalId` int DEFAULT NULL,
  `PdfPath` varchar(500) DEFAULT NULL,
  `GeneratedOn` datetime DEFAULT NULL,
  `GeneratedBy` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`AppraisalLetterId`),
  KEY `AppraisalId` (`AppraisalId`),
  CONSTRAINT `appraisalletter_ibfk_1` FOREIGN KEY (`AppraisalId`) REFERENCES `appraisal` (`AppraisalId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assets` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Asset_Name` varchar(150) NOT NULL,
  `Serial_No` varchar(100) NOT NULL,
  `Status` varchar(50) NOT NULL,
  `Assigned_To` varchar(50) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `ImagePaths` text,
  `Description` longtext,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Serial_No` (`Serial_No`),
  KEY `Assigned_To` (`Assigned_To`),
  CONSTRAINT `assets_ibfk_1` FOREIGN KEY (`Assigned_To`) REFERENCES `employees` (`Employee_Id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(50) NOT NULL,
  `Attendance_Date` date NOT NULL,
  `Check_In` datetime DEFAULT NULL,
  `Check_Out` datetime DEFAULT NULL,
  `Status` varchar(50) DEFAULT 'Absent',
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `IpAddress` varchar(50) DEFAULT NULL,
  `DeviceInfo` varchar(255) DEFAULT NULL,
  `WorkingMinutes` int DEFAULT NULL,
  `AutoCheckoutReason` varchar(255) DEFAULT NULL,
  `CheckInLatitude` decimal(10,8) DEFAULT NULL,
  `CheckInLongitude` decimal(11,8) DEFAULT NULL,
  `CheckOutLatitude` decimal(10,8) DEFAULT NULL,
  `CheckOutLongitude` decimal(11,8) DEFAULT NULL,
  `CheckoutType` varchar(100) DEFAULT NULL,
  `DistanceMeters` decimal(18,2) DEFAULT NULL,
  `IsLocationMismatch` bit(1) NOT NULL DEFAULT b'0',
  `LastActivityTime` datetime DEFAULT NULL,
  `LocationChangeReason` varchar(500) DEFAULT NULL,
  `LocationStatus` varchar(100) DEFAULT NULL,
  `TotalBreakMinutes` int NOT NULL DEFAULT '0',
  `CheckInAddress` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `CheckOutAddress` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Employee_Id` (`Employee_Id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`Employee_Id`) REFERENCES `employees` (`Employee_Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1811 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `attendancesettings`
--

DROP TABLE IF EXISTS `attendancesettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendancesettings` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `OfficeStartTime` time NOT NULL,
  `OfficeEndTime` time NOT NULL,
  `CheckInStartTime` time NOT NULL,
  `LateAfterTime` time NOT NULL,
  `CheckoutTime` time NOT NULL,
  `HalfDayHours` int NOT NULL,
  `UpdatedAt` datetime NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Branch_Name` text NOT NULL,
  `Established` date DEFAULT NULL,
  `Phone_Number` text,
  `Email` text,
  `Department_Id` text,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `Branch_Id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Branch_Id` (`Branch_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `brandingsettings`
--

DROP TABLE IF EXISTS `brandingsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brandingsettings` (
  `BrandingId` int NOT NULL AUTO_INCREMENT,
  `Company_Id` int NOT NULL,
  `CompanyLogo` varchar(500) DEFAULT NULL,
  `LoginLogo` varchar(500) DEFAULT NULL,
  `SidebarLogo` varchar(500) DEFAULT NULL,
  `LoginBackground` varchar(500) DEFAULT NULL,
  `Favicon` varchar(500) DEFAULT NULL,
  `PrimaryColor` varchar(20) DEFAULT NULL,
  `SecondaryColor` varchar(20) DEFAULT NULL,
  `ButtonColor` varchar(20) DEFAULT NULL,
  `FontFamily` varchar(100) DEFAULT NULL,
  `FooterText` varchar(500) DEFAULT NULL,
  `FooterLink` varchar(300) DEFAULT NULL,
  `SupportEmail` varchar(200) DEFAULT NULL,
  `SupportPhone` varchar(30) DEFAULT NULL,
  `IsDarkMode` tinyint(1) DEFAULT '0',
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`BrandingId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Client_Name` text NOT NULL,
  `Description` text,
  `Location` text,
  `Phone` text,
  `Email` text,
  `Active_Projects` int DEFAULT '0',
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CompanyName` varchar(255) NOT NULL,
  `EstablishedDate` date DEFAULT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `EmailAddress` varchar(255) DEFAULT NULL,
  `GSTNumber` varchar(20) DEFAULT NULL,
  `TINNumber` varchar(20) DEFAULT NULL,
  `PANNumber` varchar(20) DEFAULT NULL,
  `TotalBranches` int DEFAULT NULL,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `companysettings`
--

DROP TABLE IF EXISTS `companysettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companysettings` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CompanyName` varchar(200) NOT NULL,
  `CompanyShortName` varchar(50) DEFAULT NULL,
  `CompanyEmail` varchar(200) DEFAULT NULL,
  `CompanyPhone` varchar(50) DEFAULT NULL,
  `CompanyWebsite` varchar(200) DEFAULT NULL,
  `CompanyAddress` text,
  `LogoUrl` varchar(500) DEFAULT NULL,
  `GSTNumber` varchar(100) DEFAULT NULL,
  `CINNumber` varchar(100) DEFAULT NULL,
  `UpdatedAt` datetime NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Department_Name` text NOT NULL,
  `Department_Head` text,
  `Members_Count` int DEFAULT '0',
  `Building` text,
  `Status` text NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `Department_Id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Department_Id` (`Department_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `documentmaster`
--

DROP TABLE IF EXISTS `documentmaster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentmaster` (
  `DocumentId` int NOT NULL AUTO_INCREMENT,
  `Company_Id` int NOT NULL,
  `DocumentName` varchar(200) DEFAULT NULL,
  `Category` varchar(100) DEFAULT NULL,
  `FileName` varchar(300) DEFAULT NULL,
  `FilePath` varchar(500) DEFAULT NULL,
  `Version` varchar(20) DEFAULT NULL,
  `IsEmployeeVisible` tinyint(1) DEFAULT '1',
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`DocumentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `emailsettings`
--

DROP TABLE IF EXISTS `emailsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emailsettings` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `SenderEmail` varchar(255) NOT NULL,
  `SenderPassword` varchar(500) NOT NULL,
  `SmtpHost` varchar(255) NOT NULL,
  `SmtpPort` int NOT NULL,
  `EnableSSL` bit(1) NOT NULL,
  `DisplayName` varchar(255) DEFAULT NULL,
  `UpdatedAt` datetime NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employeeagreement`
--

DROP TABLE IF EXISTS `employeeagreement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeeagreement` (
  `EmployeeAgreementId` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(50) NOT NULL,
  `AgreementId` int NOT NULL,
  `AgreementName` varchar(200) NOT NULL,
  `AgreementVersion` varchar(20) NOT NULL,
  `SignatureName` varchar(100) DEFAULT NULL,
  `SignedOn` datetime DEFAULT NULL,
  `Status` varchar(20) NOT NULL DEFAULT 'Pending',
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `SignedLocation` varchar(255) DEFAULT NULL,
  `SignedPdfPath` varchar(500) DEFAULT NULL,
  `SignatureImagePath` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`EmployeeAgreementId`),
  KEY `AgreementId` (`AgreementId`),
  CONSTRAINT `employeeagreement_ibfk_1` FOREIGN KEY (`AgreementId`) REFERENCES `agreementmaster` (`AgreementId`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employeebankdetails`
--

DROP TABLE IF EXISTS `employeebankdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeebankdetails` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(50) NOT NULL,
  `Customer_Id` varchar(50) DEFAULT NULL,
  `Bank_Name` varchar(100) DEFAULT NULL,
  `Account_Holder_Name` varchar(100) DEFAULT NULL,
  `Account_Number` varchar(30) DEFAULT NULL,
  `IFSC_Code` varchar(20) DEFAULT NULL,
  `Branch_Name` varchar(100) DEFAULT NULL,
  `UAN_Number` varchar(30) DEFAULT NULL,
  `PF_Account_Number` varchar(30) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `Employee_Id` (`Employee_Id`),
  CONSTRAINT `employeebankdetails_ibfk_1` FOREIGN KEY (`Employee_Id`) REFERENCES `employees` (`Employee_Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employeeclearance`
--

DROP TABLE IF EXISTS `employeeclearance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeeclearance` (
  `ClearanceId` int NOT NULL AUTO_INCREMENT,
  `ResignationId` int NOT NULL,
  `ITStatus` varchar(30) DEFAULT 'Pending',
  `AdminStatus` varchar(30) DEFAULT 'Pending',
  `FinanceStatus` varchar(30) DEFAULT 'Pending',
  `HRStatus` varchar(30) DEFAULT 'Pending',
  `CompletedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`ClearanceId`),
  KEY `FK_Clearance` (`ResignationId`),
  CONSTRAINT `FK_Clearance` FOREIGN KEY (`ResignationId`) REFERENCES `employeeresignation` (`ResignationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employeedocuments`
--

DROP TABLE IF EXISTS `employeedocuments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeedocuments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(50) NOT NULL,
  `Document_Type` varchar(100) NOT NULL,
  `File_Name` varchar(255) NOT NULL,
  `File_Path` varchar(1000) NOT NULL,
  `File_Size_MB` decimal(10,2) NOT NULL,
  `Verification_Status` varchar(50) NOT NULL DEFAULT 'Pending',
  `Remarks` text,
  `Uploaded_Date` datetime NOT NULL,
  `Verified_By` varchar(100) DEFAULT NULL,
  `Verified_Date` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employeeeducation`
--

DROP TABLE IF EXISTS `employeeeducation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeeeducation` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(50) NOT NULL,
  `Degree` varchar(100) DEFAULT NULL,
  `University/Board` varchar(255) DEFAULT NULL,
  `YearOfPassing` int DEFAULT NULL,
  `Percentage/CGPA` varchar(50) DEFAULT NULL,
  `Specialization` varchar(100) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `Employee_Id` (`Employee_Id`),
  CONSTRAINT `employeeeducation_ibfk_1` FOREIGN KEY (`Employee_Id`) REFERENCES `employees` (`Employee_Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employeeexperience`
--

DROP TABLE IF EXISTS `employeeexperience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeeexperience` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(50) NOT NULL,
  `Company_Name` varchar(150) DEFAULT NULL,
  `Designation` varchar(100) DEFAULT NULL,
  `From_Date` date DEFAULT NULL,
  `To_Date` date DEFAULT NULL,
  `Reason_For_Leaving` varchar(255) DEFAULT NULL,
  `Description` text,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `Years_Of_Experience` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Employee_Id` (`Employee_Id`),
  CONSTRAINT `employeeexperience_ibfk_1` FOREIGN KEY (`Employee_Id`) REFERENCES `employees` (`Employee_Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employeegoal`
--

DROP TABLE IF EXISTS `employeegoal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeegoal` (
  `GoalId` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(20) DEFAULT NULL,
  `PerformanceCycleId` int DEFAULT NULL,
  `GoalTitle` varchar(250) DEFAULT NULL,
  `GoalDescription` text,
  `Weightage` decimal(5,2) DEFAULT NULL,
  `TargetValue` varchar(100) DEFAULT NULL,
  `AchievementValue` varchar(100) DEFAULT NULL,
  `ProgressPercentage` decimal(5,2) DEFAULT NULL,
  `Status` varchar(30) DEFAULT NULL,
  `CreatedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`GoalId`),
  KEY `PerformanceCycleId` (`PerformanceCycleId`),
  CONSTRAINT `employeegoal_ibfk_1` FOREIGN KEY (`PerformanceCycleId`) REFERENCES `performancecycle` (`PerformanceCycleId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employeeleave`
--

DROP TABLE IF EXISTS `employeeleave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeeleave` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(50) NOT NULL,
  `Employee_Name` varchar(150) NOT NULL,
  `Leave_Type` varchar(50) NOT NULL,
  `From_Date` date NOT NULL,
  `To_Date` date NOT NULL,
  `Reason` text,
  `Status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `AppliedDate` date DEFAULT NULL,
  `ApprovedBy` varchar(255) DEFAULT NULL,
  `ApprovedOn` datetime DEFAULT NULL,
  `HRStatus` varchar(100) DEFAULT NULL,
  `ManagerStatus` varchar(100) DEFAULT NULL,
  `ApprovalToken` varchar(255) DEFAULT NULL,
  `PaidLeaveDays` int DEFAULT NULL,
  `LOPDays` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Employee_Id` (`Employee_Id`),
  CONSTRAINT `employeeleave_ibfk_1` FOREIGN KEY (`Employee_Id`) REFERENCES `employees` (`Employee_Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employeelocations`
--

DROP TABLE IF EXISTS `employeelocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeelocations` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Latitude` decimal(10,8) NOT NULL,
  `Longitude` decimal(11,8) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employeemonthlyleavebalance`
--

DROP TABLE IF EXISTS `employeemonthlyleavebalance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeemonthlyleavebalance` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(50) NOT NULL,
  `LeaveYear` int NOT NULL,
  `LeaveMonth` int NOT NULL,
  `MonthlyCredit` int NOT NULL DEFAULT '1',
  `CarryForward` int NOT NULL DEFAULT '0',
  `AvailableLeaves` int NOT NULL DEFAULT '1',
  `UsedLeaves` int NOT NULL DEFAULT '0',
  `RemainingLeaves` int NOT NULL DEFAULT '1',
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `LopLeaves` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `UK_EmployeeMonth` (`Employee_Id`,`LeaveYear`,`LeaveMonth`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employeepersonalinfo`
--

DROP TABLE IF EXISTS `employeepersonalinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeepersonalinfo` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(50) NOT NULL,
  `FirstName` varchar(100) DEFAULT NULL,
  `MiddleName` varchar(100) DEFAULT NULL,
  `LastName` varchar(100) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `AadhaarNumber` varchar(20) DEFAULT NULL,
  `PanNumber` varchar(20) DEFAULT NULL,
  `BloodGroup` varchar(10) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `Marital_Status` enum('Single','Married') DEFAULT NULL,
  `Gender` enum('Male','Female','Other') DEFAULT NULL,
  `JoiningDate` datetime DEFAULT NULL,
  `Location` varchar(150) DEFAULT NULL,
  `WorkExperience` varchar(100) DEFAULT NULL,
  `Department` varchar(100) DEFAULT NULL,
  `Designation` varchar(100) DEFAULT NULL,
  `HouseNo` varchar(50) DEFAULT NULL,
  `Street` varchar(100) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `District` varchar(100) DEFAULT NULL,
  `State` varchar(100) DEFAULT NULL,
  `Country` varchar(100) DEFAULT NULL,
  `Pincode` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Employee_Id` (`Employee_Id`),
  UNIQUE KEY `AadhaarNumber` (`AadhaarNumber`),
  UNIQUE KEY `PanNumber` (`PanNumber`),
  CONSTRAINT `employeepersonalinfo_ibfk_1` FOREIGN KEY (`Employee_Id`) REFERENCES `employees` (`Employee_Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employeeresignation`
--

DROP TABLE IF EXISTS `employeeresignation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeeresignation` (
  `ResignationId` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(20) NOT NULL,
  `ResignationDate` date NOT NULL,
  `LastWorkingDate` date NOT NULL,
  `Reason` text,
  `NoticePeriod` int DEFAULT '30',
  `ManagerStatus` varchar(30) DEFAULT 'Pending',
  `HRStatus` varchar(30) DEFAULT 'Pending',
  `OverallStatus` varchar(30) DEFAULT 'Pending',
  `ManagerRemarks` text,
  `HRRemarks` text,
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ResignationId`),
  KEY `FK_Resignation_Employee` (`Employee_Id`),
  CONSTRAINT `FK_Resignation_Employee` FOREIGN KEY (`Employee_Id`) REFERENCES `employees` (`Employee_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(50) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Department` varchar(100) NOT NULL,
  `RoleName` varchar(100) NOT NULL,
  `Status` varchar(50) NOT NULL,
  `JoiningDate` datetime NOT NULL,
  `Department_Id` varchar(50) DEFAULT NULL,
  `Branch_Id` varchar(50) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `RoleId` int DEFAULT NULL,
  `CTC` decimal(18,2) DEFAULT NULL,
  `Password` text,
  `AdminId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Employee_Id` (`Employee_Id`),
  KEY `Branch_Id` (`Branch_Id`),
  KEY `Department_Id` (`Department_Id`),
  KEY `RoleId` (`RoleId`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`Branch_Id`) REFERENCES `branches` (`Branch_Id`) ON DELETE SET NULL,
  CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`Department_Id`) REFERENCES `departments` (`Department_Id`) ON DELETE SET NULL,
  CONSTRAINT `employees_ibfk_3` FOREIGN KEY (`RoleId`) REFERENCES `roles` (`RoleId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employeesalarystructures`
--

DROP TABLE IF EXISTS `employeesalarystructures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeesalarystructures` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(50) NOT NULL,
  `AnnualCTC` decimal(18,2) NOT NULL DEFAULT '0.00',
  `MonthlyCTC` decimal(18,2) NOT NULL DEFAULT '0.00',
  `BasicSalary` decimal(18,2) NOT NULL DEFAULT '0.00',
  `HRA` decimal(18,2) NOT NULL DEFAULT '0.00',
  `ConveyanceAllowance` decimal(18,2) NOT NULL DEFAULT '0.00',
  `MedicalAllowance` decimal(18,2) NOT NULL DEFAULT '0.00',
  `SpecialAllowance` decimal(18,2) NOT NULL DEFAULT '0.00',
  `EmployeePF` decimal(18,2) NOT NULL DEFAULT '0.00',
  `EmployerPF` decimal(18,2) NOT NULL DEFAULT '0.00',
  `ProfessionalTax` decimal(18,2) NOT NULL DEFAULT '0.00',
  `TDS` decimal(18,2) NOT NULL DEFAULT '0.00',
  `OtherDeduction` decimal(18,2) NOT NULL DEFAULT '0.00',
  `EffectiveFrom` datetime NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT '1',
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_EmployeeSalaryStructures_Employees` (`Employee_Id`),
  CONSTRAINT `FK_EmployeeSalaryStructures_Employees` FOREIGN KEY (`Employee_Id`) REFERENCES `employees` (`Employee_Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employeescreenshots`
--

DROP TABLE IF EXISTS `employeescreenshots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeescreenshots` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `EmployeeId` varchar(50) DEFAULT NULL,
  `ScreenshotPath` varchar(500) NOT NULL,
  `DeviceName` varchar(200) DEFAULT NULL,
  `MonitoringStatus` varchar(50) DEFAULT NULL,
  `CapturedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `FK_EmployeeScreenshots_Employee` (`EmployeeId`),
  CONSTRAINT `FK_EmployeeScreenshots_Employee` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`Employee_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employeeshiftassignment`
--

DROP TABLE IF EXISTS `employeeshiftassignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeeshiftassignment` (
  `AssignmentId` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(20) NOT NULL,
  `ShiftId` int NOT NULL,
  `EffectiveFrom` date NOT NULL,
  `EffectiveTo` date DEFAULT NULL,
  `IsActive` bit(1) NOT NULL DEFAULT b'1',
  `CreatedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`AssignmentId`),
  KEY `FK_EmployeeShiftAssignment_Shift` (`ShiftId`),
  KEY `FK_EmployeeShiftAssignment_Employee` (`Employee_Id`),
  CONSTRAINT `FK_EmployeeShiftAssignment_Employee` FOREIGN KEY (`Employee_Id`) REFERENCES `employees` (`Employee_Id`),
  CONSTRAINT `FK_EmployeeShiftAssignment_Shift` FOREIGN KEY (`ShiftId`) REFERENCES `shiftmaster` (`ShiftId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employeetds`
--

DROP TABLE IF EXISTS `employeetds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeetds` (
  `TDSId` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(50) DEFAULT NULL,
  `FinancialYear` varchar(20) DEFAULT NULL,
  `GrossSalary` decimal(18,2) DEFAULT NULL,
  `TaxableIncome` decimal(18,2) DEFAULT NULL,
  `TotalTax` decimal(18,2) DEFAULT NULL,
  `MonthlyTDS` decimal(18,2) DEFAULT NULL,
  `GeneratedOn` datetime DEFAULT NULL,
  PRIMARY KEY (`TDSId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employeeweeklyoff`
--

DROP TABLE IF EXISTS `employeeweeklyoff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeeweeklyoff` (
  `WeeklyOffId` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(20) NOT NULL,
  `DayName` varchar(20) NOT NULL,
  `EffectiveFrom` date NOT NULL,
  `EffectiveTo` date DEFAULT NULL,
  `IsActive` bit(1) DEFAULT b'1',
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`WeeklyOffId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exitdocuments`
--

DROP TABLE IF EXISTS `exitdocuments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exitdocuments` (
  `ExitDocumentId` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(20) DEFAULT NULL,
  `DocumentType` varchar(50) DEFAULT NULL,
  `PdfPath` varchar(500) DEFAULT NULL,
  `GeneratedDate` datetime DEFAULT NULL,
  `GeneratedBy` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ExitDocumentId`),
  KEY `FK_ExitDoc_Employee` (`Employee_Id`),
  CONSTRAINT `FK_ExitDoc_Employee` FOREIGN KEY (`Employee_Id`) REFERENCES `employees` (`Employee_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exitinterview`
--

DROP TABLE IF EXISTS `exitinterview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exitinterview` (
  `ExitInterviewId` int NOT NULL AUTO_INCREMENT,
  `ResignationId` int DEFAULT NULL,
  `ConductedBy` varchar(100) DEFAULT NULL,
  `ReasonForLeaving` text,
  `Feedback` text,
  `Suggestions` text,
  `InterviewDate` datetime DEFAULT NULL,
  PRIMARY KEY (`ExitInterviewId`),
  KEY `FK_ExitInterview` (`ResignationId`),
  CONSTRAINT `FK_ExitInterview` FOREIGN KEY (`ResignationId`) REFERENCES `employeeresignation` (`ResignationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `experienceletters`
--

DROP TABLE IF EXISTS `experienceletters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experienceletters` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `EmployeeId` varchar(50) NOT NULL,
  `Title` varchar(20) DEFAULT NULL,
  `Designation` varchar(150) DEFAULT NULL,
  `Department` varchar(150) DEFAULT NULL,
  `StartDate` datetime NOT NULL,
  `EndDate` datetime NOT NULL,
  `EmploymentTenure` varchar(100) DEFAULT NULL,
  `SerialNo` varchar(100) DEFAULT NULL,
  `AuthorizedSignatory` varchar(150) DEFAULT NULL,
  `AuthorizedSignatoryDesignation` varchar(150) DEFAULT NULL,
  `PdfPath` text,
  `GeneratedDate` datetime NOT NULL,
  `Status` varchar(30) NOT NULL DEFAULT 'Draft',
  `IsSent` tinyint(1) NOT NULL DEFAULT '0',
  `SentOn` datetime DEFAULT NULL,
  `SentCount` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `UK_ExperienceLetters_SerialNo` (`SerialNo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `filestorage`
--

DROP TABLE IF EXISTS `filestorage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `filestorage` (
  `FileId` int NOT NULL AUTO_INCREMENT,
  `Company_Id` int NOT NULL,
  `ModuleName` varchar(100) NOT NULL,
  `FileCategory` varchar(100) NOT NULL,
  `OriginalFileName` varchar(300) NOT NULL,
  `SavedFileName` varchar(300) NOT NULL,
  `FilePath` varchar(500) NOT NULL,
  `FileExtension` varchar(20) DEFAULT NULL,
  `FileSize` bigint DEFAULT NULL,
  `MimeType` varchar(100) DEFAULT NULL,
  `UploadedBy` varchar(100) DEFAULT NULL,
  `UploadedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `IsActive` bit(1) DEFAULT b'1',
  PRIMARY KEY (`FileId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `footersettings`
--

DROP TABLE IF EXISTS `footersettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `footersettings` (
  `FooterId` int NOT NULL AUTO_INCREMENT,
  `Company_Id` int NOT NULL,
  `FooterText` varchar(500) DEFAULT NULL,
  `FooterLink` varchar(300) DEFAULT NULL,
  `CopyrightText` varchar(500) DEFAULT NULL,
  `ProductVersion` varchar(20) DEFAULT NULL,
  `SupportEmail` varchar(200) DEFAULT NULL,
  `SupportPhone` varchar(50) DEFAULT NULL,
  `UpdatedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`FooterId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `form16`
--

DROP TABLE IF EXISTS `form16`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form16` (
  `Form16Id` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(50) DEFAULT NULL,
  `FinancialYear` varchar(20) DEFAULT NULL,
  `PdfPath` varchar(500) DEFAULT NULL,
  `GeneratedOn` datetime DEFAULT NULL,
  `GeneratedBy` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Form16Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fullfinalsettlement`
--

DROP TABLE IF EXISTS `fullfinalsettlement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fullfinalsettlement` (
  `SettlementId` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(20) DEFAULT NULL,
  `GrossSalary` decimal(18,2) DEFAULT NULL,
  `LeaveEncashment` decimal(18,2) DEFAULT NULL,
  `Bonus` decimal(18,2) DEFAULT NULL,
  `Deductions` decimal(18,2) DEFAULT NULL,
  `NetSettlement` decimal(18,2) DEFAULT NULL,
  `GeneratedDate` datetime DEFAULT NULL,
  `Status` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`SettlementId`),
  KEY `FK_FNF_Employee` (`Employee_Id`),
  CONSTRAINT `FK_FNF_Employee` FOREIGN KEY (`Employee_Id`) REFERENCES `employees` (`Employee_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `generalsettings`
--

DROP TABLE IF EXISTS `generalsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `generalsettings` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CompanyTimeZone` varchar(100) DEFAULT NULL,
  `DateFormat` varchar(50) DEFAULT NULL,
  `TimeFormat` varchar(20) DEFAULT NULL,
  `CurrencySymbol` varchar(10) DEFAULT NULL,
  `SessionTimeout` int DEFAULT NULL,
  `FinancialYearStartMonth` varchar(20) DEFAULT NULL,
  `UpdatedAt` datetime NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `goalreview`
--

DROP TABLE IF EXISTS `goalreview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goalreview` (
  `ReviewId` int NOT NULL AUTO_INCREMENT,
  `GoalId` int DEFAULT NULL,
  `Reviewer` varchar(100) DEFAULT NULL,
  `ReviewComments` text,
  `Rating` int DEFAULT NULL,
  `ReviewedOn` datetime DEFAULT NULL,
  PRIMARY KEY (`ReviewId`),
  KEY `GoalId` (`GoalId`),
  CONSTRAINT `goalreview_ibfk_1` FOREIGN KEY (`GoalId`) REFERENCES `employeegoal` (`GoalId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `holidays`
--

DROP TABLE IF EXISTS `holidays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `holidays` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Holiday_Name` text NOT NULL,
  `Holiday_Date` date NOT NULL,
  `Day` text,
  `Type` text NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jobopenings`
--

DROP TABLE IF EXISTS `jobopenings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobopenings` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Job_Title` text NOT NULL,
  `Department` text NOT NULL,
  `Experience` text,
  `Positions` int DEFAULT NULL,
  `Skills` text,
  `Status` text NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `leavesettings`
--

DROP TABLE IF EXISTS `leavesettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leavesettings` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ApprovalRoles` varchar(500) NOT NULL,
  `ExternalEmails` varchar(1000) DEFAULT NULL,
  `CcEmails` varchar(1000) DEFAULT NULL,
  `AllowHalfDay` bit(1) NOT NULL,
  `MaxLeaveDays` int NOT NULL,
  `AdvanceNoticeDays` int NOT NULL,
  `AttachmentRequired` bit(1) NOT NULL,
  `UpdatedAt` datetime NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modules` (
  `ModuleId` int NOT NULL AUTO_INCREMENT,
  `ModuleName` varchar(100) NOT NULL,
  `Type` text,
  PRIMARY KEY (`ModuleId`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `monitoringlogs`
--

DROP TABLE IF EXISTS `monitoringlogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monitoringlogs` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `EmployeeId` varchar(50) DEFAULT NULL,
  `ActiveWindow` varchar(300) DEFAULT NULL,
  `IdleMinutes` int DEFAULT '0',
  `LastActiveTime` datetime DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `monitoringsettings`
--

DROP TABLE IF EXISTS `monitoringsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monitoringsettings` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ScreenshotInterval` int DEFAULT '5',
  `EnableScreenshotMonitoring` tinyint(1) DEFAULT '1',
  `EnableActiveWindowTracking` tinyint(1) DEFAULT '1',
  `EnableIdleDetection` tinyint(1) DEFAULT '1',
  `EnableAutoUpload` tinyint(1) DEFAULT '1',
  `EnableBackgroundMonitoring` tinyint(1) DEFAULT '1',
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notificationsettings`
--

DROP TABLE IF EXISTS `notificationsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificationsettings` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `EnableEmailNotifications` bit(1) NOT NULL,
  `EnableAttendanceEmails` bit(1) NOT NULL,
  `EnableLeaveEmails` bit(1) NOT NULL,
  `EnableWFHEmails` bit(1) NOT NULL,
  `EnableTicketEmails` bit(1) NOT NULL,
  `EnableAssetEmails` bit(1) NOT NULL,
  `EnableOfferLetterEmails` bit(1) NOT NULL,
  `EnablePayslipEmails` bit(1) NOT NULL,
  `EnableLocationMismatchEmails` bit(1) NOT NULL,
  `UpdatedAt` datetime NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `offerletters`
--

DROP TABLE IF EXISTS `offerletters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offerletters` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Candidate_Name` text NOT NULL,
  `Email` text NOT NULL,
  `Position` text NOT NULL,
  `Department` text,
  `CTC_Annual` decimal(12,2) DEFAULT NULL,
  `Joining_Date` date NOT NULL,
  `Generated_On` datetime DEFAULT CURRENT_TIMESTAMP,
  `Address` text,
  `File_Path` varchar(500) DEFAULT NULL,
  `Candidate_Title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Status` varchar(20) NOT NULL DEFAULT 'Draft',
  `SentOn` datetime DEFAULT NULL,
  `PreviewPath` varchar(500) DEFAULT NULL,
  `IsSent` tinyint(1) NOT NULL DEFAULT '0',
  `SentCount` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `onboardingcandidates`
--

DROP TABLE IF EXISTS `onboardingcandidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboardingcandidates` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `OnboardingId` varchar(10) NOT NULL,
  `FullName` varchar(100) NOT NULL,
  `Email` varchar(150) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Status` varchar(20) NOT NULL DEFAULT 'Pending',
  `CreatedOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `UK_OnboardingId` (`OnboardingId`),
  UNIQUE KEY `UK_Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `onboardingdocuments`
--

DROP TABLE IF EXISTS `onboardingdocuments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboardingdocuments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `OnboardingId` varchar(10) NOT NULL,
  `DocumentType` varchar(100) DEFAULT NULL,
  `FileName` varchar(255) DEFAULT NULL,
  `FilePath` text,
  `UploadedOn` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `fk_OnboardingDocuments` (`OnboardingId`),
  CONSTRAINT `fk_OnboardingDocuments` FOREIGN KEY (`OnboardingId`) REFERENCES `onboardingcandidates` (`OnboardingId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `onboardingeducation`
--

DROP TABLE IF EXISTS `onboardingeducation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboardingeducation` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `OnboardingId` varchar(10) NOT NULL,
  `Qualification` varchar(100) DEFAULT NULL,
  `Institution` varchar(200) DEFAULT NULL,
  `University` varchar(200) DEFAULT NULL,
  `YearOfPassing` int DEFAULT NULL,
  `Percentage` decimal(5,2) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `fk_OnboardingEducation` (`OnboardingId`),
  CONSTRAINT `fk_OnboardingEducation` FOREIGN KEY (`OnboardingId`) REFERENCES `onboardingcandidates` (`OnboardingId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `onboardingexperience`
--

DROP TABLE IF EXISTS `onboardingexperience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboardingexperience` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `OnboardingId` varchar(10) NOT NULL,
  `CompanyName` varchar(200) DEFAULT NULL,
  `Designation` varchar(100) DEFAULT NULL,
  `FromDate` date DEFAULT NULL,
  `ToDate` date DEFAULT NULL,
  `YearsOfExperience` decimal(4,1) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `fk_OnboardingExperience` (`OnboardingId`),
  CONSTRAINT `fk_OnboardingExperience` FOREIGN KEY (`OnboardingId`) REFERENCES `onboardingcandidates` (`OnboardingId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `onboardingpersonalinfo`
--

DROP TABLE IF EXISTS `onboardingpersonalinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboardingpersonalinfo` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `OnboardingId` varchar(10) NOT NULL,
  `FirstName` varchar(100) DEFAULT NULL,
  `MiddleName` varchar(100) DEFAULT NULL,
  `LastName` varchar(100) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `AadhaarNumber` varchar(20) DEFAULT NULL,
  `PanNumber` varchar(20) DEFAULT NULL,
  `BloodGroup` varchar(10) DEFAULT NULL,
  `Marital_Status` enum('Single','Married') DEFAULT NULL,
  `Gender` enum('Male','Female','Other') DEFAULT NULL,
  `JoiningDate` datetime DEFAULT NULL,
  `Location` varchar(150) DEFAULT NULL,
  `WorkExperience` varchar(100) DEFAULT NULL,
  `Department` varchar(100) DEFAULT NULL,
  `Designation` varchar(100) DEFAULT NULL,
  `HouseNo` varchar(50) DEFAULT NULL,
  `Street` varchar(100) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `District` varchar(100) DEFAULT NULL,
  `State` varchar(100) DEFAULT NULL,
  `Country` varchar(100) DEFAULT NULL,
  `Pincode` varchar(10) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `OnboardingId` (`OnboardingId`),
  UNIQUE KEY `AadhaarNumber` (`AadhaarNumber`),
  UNIQUE KEY `PanNumber` (`PanNumber`),
  CONSTRAINT `fk_OnboardingPersonalInfo` FOREIGN KEY (`OnboardingId`) REFERENCES `onboardingcandidates` (`OnboardingId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payslips`
--

DROP TABLE IF EXISTS `payslips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payslips` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `EmployeeId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `FilePath` text,
  `CTC_Annual` decimal(18,2) DEFAULT NULL,
  `Generated_On` datetime DEFAULT NULL,
  `Month` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Year` int DEFAULT NULL,
  `GrossSalary` decimal(18,2) DEFAULT NULL,
  `TotalDeductions` decimal(18,2) DEFAULT NULL,
  `NetSalary` decimal(18,2) DEFAULT NULL,
  `OtherDeductions` decimal(18,2) DEFAULT NULL,
  `Total_Working_Days` decimal(10,2) DEFAULT NULL,
  `LOP_Days` decimal(10,2) DEFAULT NULL,
  `Paid_Days` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `performancecycle`
--

DROP TABLE IF EXISTS `performancecycle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `performancecycle` (
  `PerformanceCycleId` int NOT NULL AUTO_INCREMENT,
  `CycleName` varchar(100) DEFAULT NULL,
  `FinancialYear` varchar(20) DEFAULT NULL,
  `StartDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `Status` varchar(30) DEFAULT NULL,
  `CreatedBy` varchar(50) DEFAULT NULL,
  `CreatedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`PerformanceCycleId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `policysettings`
--

DROP TABLE IF EXISTS `policysettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `policysettings` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `PolicyType` varchar(100) NOT NULL,
  `PolicyTitle` varchar(200) NOT NULL,
  `PolicyContent` longtext NOT NULL,
  `Version` varchar(20) DEFAULT '1.0',
  `EffectiveFrom` date DEFAULT NULL,
  `IsActive` bit(1) NOT NULL DEFAULT b'1',
  `UpdatedAt` datetime NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Project_Name` varchar(100) NOT NULL,
  `Project_Id` varchar(50) NOT NULL,
  `Client` varchar(100) DEFAULT NULL,
  `Start_Date` date DEFAULT NULL,
  `End_Date` date DEFAULT NULL,
  `Team_Members` text,
  `Status` varchar(50) NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `ClientId` int DEFAULT NULL,
  `ProjectCode` varchar(10) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Project_Id` (`Project_Id`),
  UNIQUE KEY `ProjectCode` (`ProjectCode`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `projectteammembers`
--

DROP TABLE IF EXISTS `projectteammembers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projectteammembers` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ProjectId` int NOT NULL,
  `EmployeeId` varchar(20) NOT NULL,
  `Technology` varchar(50) NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `FK_ProjectTeamMembers_Project` (`ProjectId`),
  KEY `FK_ProjectTeamMembers_Employee` (`EmployeeId`),
  CONSTRAINT `FK_ProjectTeamMembers_Employee` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`Employee_Id`),
  CONSTRAINT `FK_ProjectTeamMembers_Project` FOREIGN KEY (`ProjectId`) REFERENCES `projects` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `relievingletter`
--

DROP TABLE IF EXISTS `relievingletter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `relievingletter` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `EmployeeId` varchar(50) NOT NULL,
  `Title` varchar(20) NOT NULL,
  `RelievingDate` date NOT NULL,
  `GeneratedDate` datetime NOT NULL,
  `DocxPath` varchar(500) DEFAULT NULL,
  `PdfPath` varchar(500) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `Status` varchar(20) NOT NULL DEFAULT 'Draft',
  `SentOn` datetime DEFAULT NULL,
  `IsSent` tinyint(1) NOT NULL DEFAULT '0',
  `SentCount` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `FK_RelievingLetter_Employee` (`EmployeeId`),
  CONSTRAINT `FK_RelievingLetter_Employee` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`Employee_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rolepermissions`
--

DROP TABLE IF EXISTS `rolepermissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rolepermissions` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `RoleId` int NOT NULL,
  `ModuleId` int NOT NULL,
  `CanAccess` tinyint(1) NOT NULL DEFAULT '0',
  `CanView` tinyint(1) NOT NULL DEFAULT '0',
  `CanAdd` tinyint(1) NOT NULL DEFAULT '0',
  `CanEdit` tinyint(1) NOT NULL DEFAULT '0',
  `CanDelete` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `RoleId` (`RoleId`),
  KEY `ModuleId` (`ModuleId`),
  CONSTRAINT `rolepermissions_ibfk_1` FOREIGN KEY (`RoleId`) REFERENCES `roles` (`RoleId`) ON DELETE CASCADE,
  CONSTRAINT `rolepermissions_ibfk_2` FOREIGN KEY (`ModuleId`) REFERENCES `modules` (`ModuleId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=928 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `RoleId` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`RoleId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roundrobinstate`
--

DROP TABLE IF EXISTS `roundrobinstate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roundrobinstate` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ProjectId` int NOT NULL,
  `Technology` varchar(100) NOT NULL,
  `LastAssignedEmployee` varchar(50) DEFAULT NULL,
  `LastAssignedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `ProjectId` (`ProjectId`,`Technology`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `salarystructureconfig`
--

DROP TABLE IF EXISTS `salarystructureconfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salarystructureconfig` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Basic_Percentage` decimal(5,2) NOT NULL,
  `Hra_Percentage_Of_Basic` decimal(5,2) NOT NULL,
  `Pf_Percentage` decimal(5,2) NOT NULL,
  `Conveyance_Fixed` decimal(10,2) NOT NULL,
  `Medical_Fixed` decimal(10,2) NOT NULL,
  `Professional_Tax_Fixed` decimal(10,2) NOT NULL,
  `Is_Active` tinyint(1) DEFAULT '1',
  `Created_Date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `schedulerlog`
--

DROP TABLE IF EXISTS `schedulerlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedulerlog` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `SchedulerName` varchar(100) NOT NULL,
  `StartedAt` datetime NOT NULL,
  `CompletedAt` datetime DEFAULT NULL,
  `TotalTickets` int DEFAULT '0',
  `AssignedTickets` int DEFAULT '0',
  `FailedTickets` int DEFAULT '0',
  `Status` varchar(30) NOT NULL,
  `ErrorMessage` text,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `schedulersettings`
--

DROP TABLE IF EXISTS `schedulersettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedulersettings` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `SettingKey` varchar(100) NOT NULL,
  `SettingValue` varchar(200) NOT NULL,
  `Description` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shiftchangerequest`
--

DROP TABLE IF EXISTS `shiftchangerequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shiftchangerequest` (
  `RequestId` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(20) NOT NULL,
  `CurrentShiftId` int NOT NULL,
  `RequestedShiftId` int NOT NULL,
  `EffectiveFrom` date NOT NULL,
  `EffectiveTo` date DEFAULT NULL,
  `IsPermanent` bit(1) DEFAULT b'0',
  `Reason` varchar(500) DEFAULT NULL,
  `Status` varchar(20) DEFAULT 'Pending',
  `ApprovedBy` varchar(50) DEFAULT NULL,
  `ApprovedDate` datetime DEFAULT NULL,
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`RequestId`),
  KEY `CurrentShiftId` (`CurrentShiftId`),
  KEY `RequestedShiftId` (`RequestedShiftId`),
  CONSTRAINT `shiftchangerequest_ibfk_1` FOREIGN KEY (`CurrentShiftId`) REFERENCES `shiftmaster` (`ShiftId`),
  CONSTRAINT `shiftchangerequest_ibfk_2` FOREIGN KEY (`RequestedShiftId`) REFERENCES `shiftmaster` (`ShiftId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shiftmaster`
--

DROP TABLE IF EXISTS `shiftmaster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shiftmaster` (
  `ShiftId` int NOT NULL AUTO_INCREMENT,
  `ShiftCode` varchar(20) NOT NULL,
  `ShiftName` varchar(100) NOT NULL,
  `StartTime` time NOT NULL,
  `EndTime` time NOT NULL,
  `BreakStart` time DEFAULT NULL,
  `BreakEnd` time DEFAULT NULL,
  `GraceTimeMinutes` int NOT NULL DEFAULT '15',
  `HalfDayHours` decimal(5,2) NOT NULL DEFAULT '4.00',
  `FullDayHours` decimal(5,2) NOT NULL DEFAULT '8.00',
  `WeeklyOff` varchar(20) DEFAULT NULL,
  `IsNightShift` bit(1) NOT NULL DEFAULT b'0',
  `IsActive` bit(1) NOT NULL DEFAULT b'1',
  `CreatedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedDate` datetime DEFAULT NULL,
  `ShiftEndNextDay` bit(1) DEFAULT b'0',
  `ShiftAllowance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `OTHoursAfter` decimal(5,2) NOT NULL DEFAULT '8.00',
  `MaxOTHours` decimal(5,2) NOT NULL DEFAULT '4.00',
  `IsFlexibleShift` bit(1) NOT NULL DEFAULT b'0',
  `AutoCheckoutHours` int NOT NULL DEFAULT '12',
  `EarlyCheckInMinutes` int NOT NULL DEFAULT '30',
  `LateCheckoutMinutes` int NOT NULL DEFAULT '30',
  PRIMARY KEY (`ShiftId`),
  UNIQUE KEY `UK_ShiftCode` (`ShiftCode`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shiftplanner`
--

DROP TABLE IF EXISTS `shiftplanner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shiftplanner` (
  `PlannerId` int NOT NULL AUTO_INCREMENT,
  `ShiftId` int NOT NULL,
  `FromDate` date NOT NULL,
  `ToDate` date NOT NULL,
  `Department_Id` int DEFAULT NULL,
  `Remarks` varchar(300) DEFAULT NULL,
  `IsPublished` bit(1) DEFAULT b'0',
  `CreatedBy` varchar(50) DEFAULT NULL,
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedBy` varchar(50) DEFAULT NULL,
  `UpdatedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`PlannerId`),
  KEY `ShiftId` (`ShiftId`),
  CONSTRAINT `shiftplanner_ibfk_1` FOREIGN KEY (`ShiftId`) REFERENCES `shiftmaster` (`ShiftId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shiftroster`
--

DROP TABLE IF EXISTS `shiftroster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shiftroster` (
  `RosterId` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(20) NOT NULL,
  `ShiftId` int NOT NULL,
  `RosterDate` date NOT NULL,
  `Remarks` varchar(300) DEFAULT NULL,
  `IsPublished` bit(1) DEFAULT b'1',
  `CreatedBy` varchar(50) DEFAULT NULL,
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedBy` varchar(50) DEFAULT NULL,
  `UpdatedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`RosterId`),
  UNIQUE KEY `Employee_Id` (`Employee_Id`,`RosterDate`),
  KEY `FK_ShiftRoster_Shift` (`ShiftId`),
  CONSTRAINT `FK_ShiftRoster_Employee` FOREIGN KEY (`Employee_Id`) REFERENCES `employees` (`Employee_Id`),
  CONSTRAINT `FK_ShiftRoster_Shift` FOREIGN KEY (`ShiftId`) REFERENCES `shiftmaster` (`ShiftId`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shiftrotation`
--

DROP TABLE IF EXISTS `shiftrotation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shiftrotation` (
  `RotationId` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(20) NOT NULL,
  `RotationType` varchar(20) NOT NULL,
  `Shift1Id` int NOT NULL,
  `Shift2Id` int DEFAULT NULL,
  `Shift3Id` int DEFAULT NULL,
  `EffectiveFrom` date NOT NULL,
  `IsActive` bit(1) DEFAULT b'1',
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`RotationId`),
  KEY `Shift1Id` (`Shift1Id`),
  KEY `Shift2Id` (`Shift2Id`),
  KEY `Shift3Id` (`Shift3Id`),
  CONSTRAINT `shiftrotation_ibfk_1` FOREIGN KEY (`Shift1Id`) REFERENCES `shiftmaster` (`ShiftId`),
  CONSTRAINT `shiftrotation_ibfk_2` FOREIGN KEY (`Shift2Id`) REFERENCES `shiftmaster` (`ShiftId`),
  CONSTRAINT `shiftrotation_ibfk_3` FOREIGN KEY (`Shift3Id`) REFERENCES `shiftmaster` (`ShiftId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shiftswap`
--

DROP TABLE IF EXISTS `shiftswap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shiftswap` (
  `SwapId` int NOT NULL AUTO_INCREMENT,
  `FromEmployeeId` varchar(20) NOT NULL,
  `ToEmployeeId` varchar(20) NOT NULL,
  `ShiftDate` date NOT NULL,
  `ShiftId` int NOT NULL,
  `Reason` varchar(500) DEFAULT NULL,
  `Status` varchar(20) DEFAULT 'Pending',
  `ApprovedBy` varchar(50) DEFAULT NULL,
  `ApprovedDate` datetime DEFAULT NULL,
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`SwapId`),
  KEY `ShiftId` (`ShiftId`),
  CONSTRAINT `shiftswap_ibfk_1` FOREIGN KEY (`ShiftId`) REFERENCES `shiftmaster` (`ShiftId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `superadmins`
--

DROP TABLE IF EXISTS `superadmins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `superadmins` (
  `SuperAdminId` int NOT NULL AUTO_INCREMENT,
  `FullName` varchar(100) NOT NULL,
  `Email` varchar(150) NOT NULL,
  `PasswordHash` text NOT NULL,
  `Mobile` varchar(20) DEFAULT NULL,
  `IsActive` bit(1) DEFAULT b'1',
  `LastLogin` datetime DEFAULT NULL,
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `Role` varchar(50) NOT NULL DEFAULT 'SuperAdmin',
  PRIMARY KEY (`SuperAdminId`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `taskmanagement`
--

DROP TABLE IF EXISTS `taskmanagement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taskmanagement` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Task_Title` varchar(200) NOT NULL,
  `Project` varchar(100) DEFAULT NULL,
  `Priority` varchar(50) NOT NULL,
  `Status` varchar(50) NOT NULL,
  `Due_Date` date DEFAULT NULL,
  `Assigned_To` varchar(50) NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `Description` text,
  PRIMARY KEY (`Id`),
  KEY `Assigned_To` (`Assigned_To`),
  CONSTRAINT `taskmanagement_ibfk_1` FOREIGN KEY (`Assigned_To`) REFERENCES `employees` (`Employee_Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `taxdeclaration`
--

DROP TABLE IF EXISTS `taxdeclaration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taxdeclaration` (
  `TaxDeclarationId` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(50) NOT NULL,
  `FinancialYear` varchar(20) NOT NULL,
  `Regime` enum('Old','New') NOT NULL,
  `TotalDeclaredAmount` decimal(18,2) DEFAULT '0.00',
  `Status` enum('Draft','Submitted','Approved','Rejected') DEFAULT 'Draft',
  `SubmittedOn` datetime DEFAULT NULL,
  `ApprovedBy` varchar(50) DEFAULT NULL,
  `ApprovedOn` datetime DEFAULT NULL,
  `Remarks` text,
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`TaxDeclarationId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `taxdeclarationitem`
--

DROP TABLE IF EXISTS `taxdeclarationitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taxdeclarationitem` (
  `ItemId` int NOT NULL AUTO_INCREMENT,
  `TaxDeclarationId` int NOT NULL,
  `SectionName` varchar(100) DEFAULT NULL,
  `SectionCode` varchar(20) DEFAULT NULL,
  `DeclaredAmount` decimal(18,2) DEFAULT NULL,
  `ApprovedAmount` decimal(18,2) DEFAULT NULL,
  PRIMARY KEY (`ItemId`),
  KEY `TaxDeclarationId` (`TaxDeclarationId`),
  CONSTRAINT `taxdeclarationitem_ibfk_1` FOREIGN KEY (`TaxDeclarationId`) REFERENCES `taxdeclaration` (`TaxDeclarationId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `taxproof`
--

DROP TABLE IF EXISTS `taxproof`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taxproof` (
  `ProofId` int NOT NULL AUTO_INCREMENT,
  `ItemId` int DEFAULT NULL,
  `FileName` varchar(255) DEFAULT NULL,
  `FilePath` varchar(500) DEFAULT NULL,
  `UploadedOn` datetime DEFAULT CURRENT_TIMESTAMP,
  `Status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  PRIMARY KEY (`ProofId`),
  KEY `ItemId` (`ItemId`),
  CONSTRAINT `taxproof_ibfk_1` FOREIGN KEY (`ItemId`) REFERENCES `taxdeclarationitem` (`ItemId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teammemberoverrides`
--

DROP TABLE IF EXISTS `teammemberoverrides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teammemberoverrides` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TeamMemberId` int NOT NULL,
  `IsCrossMapped` bit(1) DEFAULT b'0',
  `OverrideProjectId` int DEFAULT NULL,
  `CustomReportingDays` bit(1) NOT NULL DEFAULT b'0',
  `DifferentProject` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`Id`),
  KEY `FK_TeamMemberOverrides_TeamMember` (`TeamMemberId`),
  KEY `FK_TeamMemberOverrides_Project` (`OverrideProjectId`),
  CONSTRAINT `FK_TeamMemberOverrides_Project` FOREIGN KEY (`OverrideProjectId`) REFERENCES `projects` (`Id`),
  CONSTRAINT `FK_TeamMemberOverrides_TeamMember` FOREIGN KEY (`TeamMemberId`) REFERENCES `teammembers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teammemberreportingdays`
--

DROP TABLE IF EXISTS `teammemberreportingdays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teammemberreportingdays` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TeamMemberId` int NOT NULL,
  `DayName` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_TeamMemberReportingDays_TeamMember` (`TeamMemberId`),
  CONSTRAINT `FK_TeamMemberReportingDays_TeamMember` FOREIGN KEY (`TeamMemberId`) REFERENCES `teammembers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teammembers`
--

DROP TABLE IF EXISTS `teammembers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teammembers` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TeamId` int NOT NULL,
  `EmployeeId` varchar(50) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_TeamMembers_Team` (`TeamId`),
  KEY `FK_TeamMembers_Employee` (`EmployeeId`),
  CONSTRAINT `FK_TeamMembers_Employee` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`Employee_Id`),
  CONSTRAINT `FK_TeamMembers_Team` FOREIGN KEY (`TeamId`) REFERENCES `teams` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teamreportingdays`
--

DROP TABLE IF EXISTS `teamreportingdays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teamreportingdays` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TeamId` int NOT NULL,
  `DayName` varchar(20) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_TeamReportingDays_Team` (`TeamId`),
  CONSTRAINT `FK_TeamReportingDays_Team` FOREIGN KEY (`TeamId`) REFERENCES `teams` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TeamNumber` varchar(50) NOT NULL,
  `TeamName` varchar(100) NOT NULL,
  `ReportingManagerId` varchar(50) NOT NULL,
  `EngagementType` varchar(50) DEFAULT NULL,
  `ProjectId` int DEFAULT NULL,
  `IsActive` bit(1) DEFAULT b'1',
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `TeamNumber` (`TeamNumber`),
  KEY `FK_Teams_Project` (`ProjectId`),
  KEY `FK_Teams_ReportingManager` (`ReportingManagerId`),
  CONSTRAINT `FK_Teams_Project` FOREIGN KEY (`ProjectId`) REFERENCES `projects` (`Id`),
  CONSTRAINT `FK_Teams_ReportingManager` FOREIGN KEY (`ReportingManagerId`) REFERENCES `employees` (`Employee_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `templatemaster`
--

DROP TABLE IF EXISTS `templatemaster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `templatemaster` (
  `TemplateId` int NOT NULL AUTO_INCREMENT,
  `Company_Id` int NOT NULL,
  `TemplateCode` varchar(50) DEFAULT NULL,
  `TemplateName` varchar(200) DEFAULT NULL,
  `TemplateCategory` varchar(100) DEFAULT NULL,
  `FileName` varchar(300) DEFAULT NULL,
  `FilePath` varchar(500) DEFAULT NULL,
  `Version` varchar(20) DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT '1',
  `IsDefault` tinyint(1) DEFAULT '0',
  `CreatedBy` varchar(100) DEFAULT NULL,
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`TemplateId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ticketassignments`
--

DROP TABLE IF EXISTS `ticketassignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticketassignments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TicketId` int NOT NULL,
  `EmployeeId` varchar(50) NOT NULL,
  `Status` varchar(50) DEFAULT 'Assigned',
  `AssignedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `IsAccepted` bit(1) DEFAULT b'0',
  PRIMARY KEY (`Id`),
  KEY `TicketId` (`TicketId`),
  KEY `EmployeeId` (`EmployeeId`),
  CONSTRAINT `ticketassignments_ibfk_1` FOREIGN KEY (`TicketId`) REFERENCES `tickets` (`Id`),
  CONSTRAINT `ticketassignments_ibfk_2` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`Employee_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tickethistory`
--

DROP TABLE IF EXISTS `tickethistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickethistory` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TicketId` int NOT NULL,
  `EmployeeId` varchar(50) DEFAULT NULL,
  `Action` varchar(100) NOT NULL,
  `OldStatus` varchar(50) DEFAULT NULL,
  `NewStatus` varchar(50) DEFAULT NULL,
  `Remarks` text,
  `CreatedBy` varchar(50) DEFAULT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `IX_TicketHistory_TicketId` (`TicketId`),
  KEY `IX_TicketHistory_Employee` (`EmployeeId`),
  CONSTRAINT `FK_TicketHistory_Ticket` FOREIGN KEY (`TicketId`) REFERENCES `tickets` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TicketNumber` varchar(30) NOT NULL,
  `ProjectId` int NOT NULL,
  `Title` varchar(250) NOT NULL,
  `Description` text,
  `Technology` varchar(100) NOT NULL,
  `Module` varchar(100) DEFAULT NULL,
  `Priority` enum('Low','Medium','High','Critical') NOT NULL DEFAULT 'Medium',
  `Status` varchar(50) NOT NULL DEFAULT 'Pending Assignment',
  `AssignedTo` varchar(50) DEFAULT NULL,
  `AssignedBy` varchar(50) NOT NULL,
  `AssignedDate` datetime DEFAULT NULL,
  `OpenedDate` datetime DEFAULT NULL,
  `CompletedDate` datetime DEFAULT NULL,
  `OverdueDate` datetime DEFAULT NULL,
  `DelayMinutes` int NOT NULL DEFAULT '0',
  `StartDate` date DEFAULT NULL,
  `DueDate` date DEFAULT NULL,
  `Deadline` datetime DEFAULT NULL,
  `EstimatedHours` decimal(5,2) DEFAULT NULL,
  `ActualHours` decimal(10,2) NOT NULL DEFAULT '0.00',
  `RemainingHours` decimal(10,2) NOT NULL DEFAULT '0.00',
  `SLAStatus` varchar(30) NOT NULL DEFAULT 'Pending',
  `AssignmentType` varchar(50) DEFAULT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT '1',
  `AssignedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `TicketNumber` (`TicketNumber`),
  KEY `FK_Tickets_AssignedBy` (`AssignedBy`),
  KEY `IX_Tickets_Status` (`Status`),
  KEY `IX_Tickets_Project` (`ProjectId`),
  KEY `IX_Tickets_Technology` (`Technology`),
  KEY `IX_Tickets_Module` (`Module`),
  KEY `IX_Tickets_AssignedTo` (`AssignedTo`),
  KEY `IX_Tickets_Deadline` (`Deadline`),
  CONSTRAINT `FK_Tickets_AssignedBy` FOREIGN KEY (`AssignedBy`) REFERENCES `employees` (`Employee_Id`),
  CONSTRAINT `FK_Tickets_AssignedTo` FOREIGN KEY (`AssignedTo`) REFERENCES `employees` (`Employee_Id`),
  CONSTRAINT `FK_Tickets_Project` FOREIGN KEY (`ProjectId`) REFERENCES `projects` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tickettimer`
--

DROP TABLE IF EXISTS `tickettimer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickettimer` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TicketId` int NOT NULL,
  `EmployeeId` varchar(50) NOT NULL,
  `StartTime` datetime NOT NULL,
  `EndTime` datetime DEFAULT NULL,
  `WorkedMinutes` int NOT NULL DEFAULT '0',
  `WorkingDate` date NOT NULL,
  `Status` varchar(30) NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `IX_TicketTimer_Ticket` (`TicketId`),
  KEY `IX_TicketTimer_Employee` (`EmployeeId`),
  KEY `IX_TicketTimer_Date` (`WorkingDate`),
  CONSTRAINT `FK_TicketTimer_Ticket` FOREIGN KEY (`TicketId`) REFERENCES `tickets` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ticketworklogs`
--

DROP TABLE IF EXISTS `ticketworklogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticketworklogs` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TicketId` int NOT NULL,
  `EmployeeId` varchar(100) NOT NULL,
  `StartTime` datetime NOT NULL,
  `EndTime` datetime DEFAULT NULL,
  `WorkedMinutes` int NOT NULL DEFAULT '0',
  `Remarks` text,
  `IsRunning` bit(1) NOT NULL DEFAULT b'0',
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `IX_TicketWorkLogs_TicketId` (`TicketId`),
  KEY `IX_TicketWorkLogs_EmployeeId` (`EmployeeId`),
  KEY `IX_TicketWorkLogs_IsRunning` (`IsRunning`),
  CONSTRAINT `FK_TicketWorkLogs_Tickets` FOREIGN KEY (`TicketId`) REFERENCES `tickets` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usernotifications`
--

DROP TABLE IF EXISTS `usernotifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usernotifications` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(50) NOT NULL,
  `Title` varchar(200) NOT NULL,
  `Message` text NOT NULL,
  `IsRead` tinyint(1) DEFAULT '0',
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `Employee_Id` (`Employee_Id`),
  CONSTRAINT `usernotifications_ibfk_1` FOREIGN KEY (`Employee_Id`) REFERENCES `employees` (`Employee_Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userpermission`
--

DROP TABLE IF EXISTS `userpermission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userpermission` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `EmployeeId` varchar(50) NOT NULL,
  `ModuleId` int NOT NULL,
  `CanAccess` tinyint(1) NOT NULL DEFAULT '0',
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `CanView` tinyint(1) NOT NULL DEFAULT '0',
  `CanAdd` tinyint(1) NOT NULL DEFAULT '0',
  `CanEdit` tinyint(1) NOT NULL DEFAULT '0',
  `CanDelete` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `EmployeeId` (`EmployeeId`,`ModuleId`),
  KEY `ModuleId` (`ModuleId`),
  CONSTRAINT `userpermission_ibfk_1` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`Employee_Id`) ON DELETE CASCADE,
  CONSTRAINT `userpermission_ibfk_2` FOREIGN KEY (`ModuleId`) REFERENCES `modules` (`ModuleId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `FirstName` text NOT NULL,
  `LastName` text NOT NULL,
  `Email` text NOT NULL,
  `Password` text NOT NULL,
  `IsOtpVerified` tinyint(1) DEFAULT '0',
  `OtpCode` text,
  `OtpExpiry` datetime DEFAULT NULL,
  `RoleId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `RoleId` (`RoleId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`RoleId`) REFERENCES `roles` (`RoleId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `workflowhistory`
--

DROP TABLE IF EXISTS `workflowhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workflowhistory` (
  `HistoryId` int NOT NULL AUTO_INCREMENT,
  `WorkflowId` int DEFAULT NULL,
  `RecordId` int DEFAULT NULL,
  `StepNo` int DEFAULT NULL,
  `ApprovedBy` varchar(50) DEFAULT NULL,
  `ActionTaken` varchar(30) DEFAULT NULL,
  `Remarks` text,
  `ActionDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`HistoryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `workflowmaster`
--

DROP TABLE IF EXISTS `workflowmaster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workflowmaster` (
  `WorkflowId` int NOT NULL AUTO_INCREMENT,
  `ModuleName` varchar(100) DEFAULT NULL,
  `WorkflowName` varchar(100) DEFAULT NULL,
  `IsActive` bit(1) DEFAULT b'1',
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`WorkflowId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `workflowsteps`
--

DROP TABLE IF EXISTS `workflowsteps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workflowsteps` (
  `StepId` int NOT NULL AUTO_INCREMENT,
  `WorkflowId` int DEFAULT NULL,
  `StepNo` int DEFAULT NULL,
  `RoleName` varchar(50) DEFAULT NULL,
  `ActionName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`StepId`),
  KEY `WorkflowId` (`WorkflowId`),
  CONSTRAINT `workflowsteps_ibfk_1` FOREIGN KEY (`WorkflowId`) REFERENCES `workflowmaster` (`WorkflowId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `workfromhomerequests`
--

DROP TABLE IF EXISTS `workfromhomerequests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workfromhomerequests` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Employee_Id` varchar(50) DEFAULT NULL,
  `Employee_Name` varchar(100) DEFAULT NULL,
  `From_Date` date DEFAULT NULL,
  `To_Date` date DEFAULT NULL,
  `Reason` varchar(500) DEFAULT NULL,
  `Status` varchar(50) DEFAULT 'Pending',
  `ApprovedBy` varchar(100) DEFAULT NULL,
  `ApprovedOn` datetime DEFAULT NULL,
  `AppliedOn` datetime DEFAULT CURRENT_TIMESTAMP,
  `LeaveType` varchar(100) DEFAULT NULL,
  `ManagerStatus` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT 'Pending',
  `HRStatus` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT 'Pending',
  `ApprovalToken` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-08 15:13:56
