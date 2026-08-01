export type PaymentMethod = "momo" | "airtel";

export const PAYMENT_NUMBER = "0793024613";
export const PAYMENT_NUMBER_DISPLAY = "0793 024 613";

export const PAYMENT_METHODS: Record<PaymentMethod, { label: string; ussd: string; steps: string[] }> = {
  momo: {
    label: "MTN Mobile Money (MoMo)",
    ussd: "*182*1*1#",
    steps: [
      `Dial ${"*182*1*1#"} on your MTN line`,
      `Enter the number ${PAYMENT_NUMBER_DISPLAY} as the recipient`,
      "Enter the exact amount shown below",
      "Confirm with your MoMo PIN",
      "You'll receive an SMS with a transaction ID — copy it",
    ],
  },
  airtel: {
    label: "Airtel Money",
    ussd: "*185#",
    steps: [
      `Dial ${"*185#"} on your Airtel line`,
      "Choose 'Send Money' then 'To Airtel Number'",
      `Enter the number ${PAYMENT_NUMBER_DISPLAY} as the recipient`,
      "Enter the exact amount shown below",
      "Confirm with your Airtel Money PIN",
      "You'll receive an SMS with a transaction ID — copy it",
    ],
  },
};
