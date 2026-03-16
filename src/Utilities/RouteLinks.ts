import UserRoles from "./UserRoles";

// 1. Define all your application paths
export const RoutesLink = {
  home: "/",
  signin: "/signin",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  verifyOtp: "/verify-otp",
  resetPassword: "/reset-password",
  error404: "/error-404",
  dashboard: "/dashboard",
  userManagement: "/user-management",
  transaction: "/transaction",
  settlements: "/settlements",
  recipients: "/recipients",
  bulkPayout: "/bulk-payout",
  qr: "/qr",
  // payout: "/payout",
  myAccount: "/my-account",
  profile: "/profile",
  calendar: "/calendar",
  blank: "/blank",
  bankAccount: "/bank-account",
  basicTables: "/basic-tables",
  formElements: "/form-elements",
  lineChart: "/line-chart",
  barChart: "/bar-chart",
  alerts: "/alerts",
  avatars: "/avatars",
  badge: "/badge",
  buttons: "/buttons",
  images: "/images",
  modals: "/modals",
  videos: "/videos",
  funds: "/funds",
  transactions:'/transactions',
  apidocs: "/developer/api-document",
  credentials: "/developer/credentials",
} as const;

// 2. Define Public Routes (No login required)
const publicRoutesSet = new Set<string>([
  RoutesLink.home,
  RoutesLink.signin,
  RoutesLink.signup,
  RoutesLink.forgotPassword,
  RoutesLink.verifyOtp,
  RoutesLink.resetPassword,
  RoutesLink.error404,
]);

// 3. Define Role Permissions Mapping
// This is where you decide who can access what.
const ADMIN = [UserRoles.admin];
const USER = [UserRoles.user];
const BOTH = [UserRoles.admin, UserRoles.user];

const routePermissions: Record<string, string[]> = {
  // Common Access
  [RoutesLink.dashboard]: BOTH,
  [RoutesLink.transaction]: BOTH,
  // [RoutesLink.payout]: BOTH,
  [RoutesLink.myAccount]: BOTH,
  [RoutesLink.profile]: BOTH,
  [RoutesLink.calendar]: BOTH,

  // Admin Only Access
  [RoutesLink.userManagement]: ADMIN,
  [RoutesLink.settlements]: ADMIN,
  [RoutesLink.bulkPayout]: ADMIN,
  [RoutesLink.bankAccount]: ADMIN,
  
  // User Only Access (Example)
  [RoutesLink.recipients]: USER,
  [RoutesLink.qr]: USER,

  // UI Kit / Dev Routes (Usually Admin only)
  [RoutesLink.basicTables]: ADMIN,
  [RoutesLink.formElements]: ADMIN,
  [RoutesLink.lineChart]: ADMIN,
  [RoutesLink.barChart]: ADMIN,
  [RoutesLink.alerts]: ADMIN,
  [RoutesLink.avatars]: ADMIN,
  [RoutesLink.badge]: ADMIN,
  [RoutesLink.buttons]: ADMIN,
  [RoutesLink.images]: ADMIN,
  [RoutesLink.modals]: ADMIN,
  [RoutesLink.videos]: ADMIN,
  [RoutesLink.blank]: ADMIN,
  [RoutesLink.funds]: BOTH,
  [RoutesLink.transactions]: BOTH,
  [RoutesLink.apidocs]: ADMIN,
  [RoutesLink.credentials]: ADMIN,
};

// 4. Export logic to be used by your Middleware or Router
export const privateRoutes = (Object.values(RoutesLink) as string[])
  .filter((path) => !publicRoutesSet.has(path))
  .map((path) => ({
    path,
    // If permission is not defined, default to Admin only for security
    roles: routePermissions[path] || ADMIN,
  }));

// Useful helper to check if a route is public
export const isPublicRoute = (path: string) => publicRoutesSet.has(path);
