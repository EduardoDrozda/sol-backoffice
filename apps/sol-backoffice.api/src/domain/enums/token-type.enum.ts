export const TokenTypeEnum = {
  EMAIL_CONFIRMATION: 'email_confirmation',
  FORGOT_PASSWORD: 'forgot_password',
} as const;

export type TokenTypeEnum = (typeof TokenTypeEnum)[keyof typeof TokenTypeEnum];