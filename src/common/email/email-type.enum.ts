export const EmailTypeEnum = {
  WELCOME: 'welcome',
  FORGOT_PASSWORD: 'forgot_password',
  RESEND_CONFIRMATION: 'resend_confirmation',
} as const;

export const EmailTemplateEnum = {
  WELCOME: 'welcome',
  FORGOT_PASSWORD: 'forgot-password',
  RESEND_CONFIRMATION: 'resend-confirmation',
} as const;

export type EmailTypeEnum = (typeof EmailTypeEnum)[keyof typeof EmailTypeEnum];