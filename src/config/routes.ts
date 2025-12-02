/**
 * Application Routes Configuration
 * Centralized route definitions for the entire application
 */

export const ROUTES = {
  // Public Routes
  HOME: "/",
  LOGIN: "/login",

  // Admin Routes
  ADMIN: {
    BASE: "/admin",
    DASHBOARD: "/admin/dashboard",
    STUDENTS: "/admin/students",
    CLASSES: "/admin/classes",
    SLOTS: "/admin/slots",
    SEMESTERS: "/admin/semesters",
    ROLES: "/admin/roles",
    CREDENTIALS: "/admin/credentials",
    REPORTS: "/admin/reports",
    SECURITY: "/admin/security",
    BLOCKCHAIN: "/admin/blockchain",
  },

  // Student Portal Routes
  STUDENT_PORTAL: {
    BASE: "/student-portal",
    DASHBOARD: "/student-portal",
    ROADMAP: "/student-portal/roadmap",
    CREDENTIALS: "/student-portal/credentials",
    CREDENTIAL_DETAIL: "/student-portal/credentials/:id",
    TIMETABLE: "/student-portal/timetable",
    COURSE_REGISTRATION: "/student-portal/course-registration",
    ATTENDANCE_REPORT: "/student-portal/attendance-report",
    GRADE_REPORT: "/student-portal/grade-report",
    SHARE: "/student-portal/share",
    PROFILE: "/student-portal/profile",
    ACTIVITY_DETAIL: "/student-portal/activity/:id",
    INSTRUCTOR_DETAIL: "/student-portal/instructor/:code",
    CLASS_LIST: "/student-portal/class-list/:courseCode",
  },

  // Teacher Routes
  TEACHER: {
    BASE: "/teacher",
    SCHEDULE: "/teacher/schedule",
    GRADING: "/teacher/grading",
    RESULTS: "/teacher/results",
    CLASS_LIST: "/teacher/class-list/:courseCode",
  },

  // Public Portal Routes (now at root level)
  PUBLIC_PORTAL: {
    BASE: "/",
    HOME: "/",
    VERIFY: "/verify",
    RESULTS: "/results",
    HISTORY: "/history",
    HELP: "/help",
  },
} as const;

export default ROUTES;

