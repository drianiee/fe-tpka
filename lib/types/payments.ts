export type CreatePaymentRequest = {
  schedule_id: number;
  amount: number;
};

export type CreatePaymentResponse = {
  snap_token: string;
  order_id: string;
};

export type ParticipantRegisterResponse = {
  message: string;
  order_id: string;
  payment: {
    status: string;
    amount: string | number;
  };
  midtrans: {
    token: string | null;
    redirect_url: string | null;
  };
};
