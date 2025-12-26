// lib/types/partners.ts

export type PartnerListItem = {
  id: number;
  name: string;
  code?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type PartnerLite = {
  id: number;
  name: string;
};

export type CreatePartnerRequest = {
  name: string;
  code?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  is_active?: boolean;
};

export type CreatePartnerResponse = {
  message: string;
  partner: PartnerListItem;
};
