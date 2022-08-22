import { template } from "handlebars";

export enum ContentType {
  BMP = 'image/bmp',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
}

export const EmailMapping = {
  USER_RESET_PASSWORD: {
    title: 'Ari : Reset Mật Khẩu',
    templateFolder: 'reset-password-user',
  },

  USER_ACTIVE_ACCOUNT: {
    title: 'Ari:  Kích Hoạt Tài Khoản',
    templateFolder: 'active-account',
  },

  USER_RESEND_ACTIVE_ACCOUNT: {
    title: 'Ari:  Kích Hoạt Tài Khoản  (gửi lại)',
    templateFolder: 'resend-active-account',
  },

  USER_SET_PASSWORD: {
    title: 'Ari:  Đặt Lại Mật Khẩu',
    templateFolder: 'set-password',
  },
  USER_RECRUITMENT: {
    title: 'Ari:  RECRUITMENT FROM WEBSITE ARI.COM.VN',
    templateFolder: 'recruitment',
  },
  USER_CONTACT: {
    title: 'Ari:  CONTACT FROM WEBSITE ARI.COM.VN',
    templateFolder: 'contact',
  }
};
