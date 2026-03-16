
import { DropdownOption } from "@/components/ui/Dropdown";
import { LucideProps } from "lucide-react";

export interface ApiResponse {
  success: boolean;
  message: string;
  errors?: any;
  data?: any;
}

export type pageType =
  | "verifyOTP"
  | "forgotPassword"
  | "default"
  | "resetPassword"
  | "passwordResetVerify";

export interface phone {
  phone: string;
  dialCode: string;
}

// Define the props interface
export interface IIconProps {
  width?: string | number;
  height?: string | number;
  color?: string;
  className?: string;
}

export interface ICommonList {
  label: string;
  value: string | number;
  disabled?: boolean;
  render?: (row: any) => React.ReactNode;
}
export interface ICommonTable {
  tableHeading: ICommonList[];
  tableData: any[];
  ActionData?: any[];
  isLoading?: boolean;
  handleStatusToggle?: (id: any, type: string, status: boolean) => void;
  getDropdownOptions?: (item: any) => DropdownOption[];
  selectable?: boolean;
  selectedItems?: Set<string | number>;
  handleSelectAll?: (checked: boolean) => void;
  handleSelectItem?: (item: any, checked: boolean) => void;
  isAllSelected?: boolean;
}

export interface IFilterData {
  search?: string;
  status?: string;
  type?: string;
  teamId?: string;
  role?: string;
  from_date?: string;
  to_date?: string;
}

export interface IPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface IEvent {
  name: string;
  value: string;
}

export interface ITableFilterProps {
  filterCanvasToggle?: (isClose: boolean) => void;
  setFilterData?: React.Dispatch<React.SetStateAction<IFilterData>>;
  sortList?: SortList;
  formData?: IFilterData;
  handleChange?: (e: IEvent) => void;
  exportOptions?: DownloadOption[];
}

export interface IPageDropdownSelect {
  options: number[];
  selected: number;
  onSelect: (value: number) => void;
  className?: string;
  buttonClass?: string;
}

export interface SearchSelectProps {
  label: string;
  options: ICommonList[];
  value: ICommonList | null;
  onSelect: (option: ICommonList | null) => void;
  onSearch?: (term: string) => void;
  onAddClick?: () => void;
  placeholder?: string;
  isLoading?: boolean;
  errors?: string;
  required?: boolean;
  showAddButton?: boolean;
  className?: string;
  disabled?: boolean;
}

export type ModernService = {
  id?: number;
  title?: string;
  description?: string;
  icon?: React.ElementType<LucideProps>;
  iconColorClass?: string;
  primaryActionText?: string;
  secondaryActionText?: string;
  image?: string;
  is_locked?: boolean;
  url?: string;
  url_id?: string;
  category?: string;
  is_purchased?: boolean;
};

export interface CityData {
  [state: string]: string[];
}

export type SortList = Record<string, ICommonList[] | undefined>;

export interface DownloadOption {
  label: string;
  href?: string;
  fileName?: string;
  onClick?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export interface ThemeData {
  user_id?: number;
  id?: number;
  template?: string;
  domain?: string;
  logo?: string;
  mobile_logo?: string;
  apk_url?: string;
  primary_color?: string;
  secondary_color?: string;
  success_color?: string | null;
  info_color?: string | null;
  company_name?: string;
  address?: string | null;
  email?: string | null;
  mobile_number?: string | null;
  seo?: string | null;
  social_links?: string | null;
  footer_text?: string | null;
  status?: "active" | "inactive" | string;
  created_at?: string; // ISO timestamp
  updated_at?: string; // ISO timestamp
}

export interface Plan {
  id?: number;
  name: string;
  description: string;
  status: number;
  amount: string;
  features: string; // JSON string based on user input
  role: string; // Role type: retailer, distributor, etc.
}

export interface User {
  id: number;
  unique_id: string;
  name: string;
  email: string;
  email_verified_at: string | null;
  phone: string;
  role: string;
  plan_id: number | null;
  parent_id: number;
  parent_type: string;
  domain: string;
  photo: string;
  is_blocked: boolean;
  is_suspended: boolean;
  notes: string | null;
  aadhar_front: string | null;
  aadhar_back: string | null;
  pan: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  wallet_balance: string;
  wallet_hold: string;
  wallet_status: "active" | "inactive" | string;
  created_at: string;
  updated_at: string;
}

export interface Recipient {
  id: number;
  user_id: number;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  account_holder_name: string;
  is_favorite: boolean;
  status: "pending" | "approved" | "rejected";
  reason: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface SettingsData {
  app_name: string;
  support_number: string;
  support_email: string;
  contact_address: string;
  facebook_link?: string;
  twitter_link?: string;
  instagram_link?: string;
  linkedin_link?: string;
  url1?: string;
  url2: string;
  allow_registration?: string;
}
