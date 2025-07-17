export const EmailTypeEnum = {
  WELCOME: 'welcome',
  FORGOT_PASSWORD: 'forgot_password',
} as const;

export const EmailTemplateEnum = {
  WELCOME: 'welcome',
  FORGOT_PASSWORD: 'forgot-password',
} as const;

export type EmailTypeEnum = (typeof EmailTypeEnum)[keyof typeof EmailTypeEnum];