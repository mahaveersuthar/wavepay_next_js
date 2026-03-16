import { profile } from "console";

export const ApiRoutes = {
  register: "register",
  logIn: "login",
  forgotPassword: "forgot-password",
  logout: "logout",
  verifyOTP: "verify-otp",
  resetPassword: "reset-password",
  profile: "profile",
  dashboardStats:'dashboard/stats',
  transactions:'transactions',
  loginHistory:'login-history',
  users:'admin/users',
  payout:'payout/transfer',
  fundRequests:'fund/requests',
  fundRequestCreate:'fund/request',
  setCharges:'set-charges',
  getCharges:'get-charges',
  apiCredentailsDetail:'api-credentials/details',
  generateCredentials:'api-credentials/generate',
  credentailsReadOtp:'api-credentials/send-otp-for-credentials-update',
  regenerateKey:'api-credentials/regenerate-secret',
  apidocs:'api-credentials/api-document',
  
} as const;
