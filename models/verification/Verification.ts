export type VerificationType = 'nin' | 'phone' | 'demo' | 'bvn';
export type BvnSlipType = 'basic' | 'plastic' | 'regular_pro';

export interface NinVerificationData {
  nin?: string;
  firstname?: string;
  lastname?: string;
  middlename?: string;
  gender?: string;
  dob?: string;
  birthdate?: string;
  telephoneno?: string;
  phone?: string;
  photo?: string;
  residence_address?: string;
  residence_state?: string;
  residence_lga?: string;
  tracking_id?: string;
  vnin?: string;
  [key: string]: unknown;
}

export interface BvnVerificationData {
  bvn?: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  gender?: string;
  date_of_birth?: string;
  phone_number?: string;
  image?: string;
  state_of_origin?: string;
  lga_of_origin?: string;
  [key: string]: unknown;
}

export interface VerificationHistoryItem {
  id: string;
  user_id: string;
  service_type?: string;
  verification_type?: string;
  query_value?: string;
  nin_query?: string;
  phone_query?: string;
  amount_charged: number;
  status?: string;
  created_at: string;
}
