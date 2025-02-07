type UserRegister = {
  email: string;
  name: string;
  password: string;
};

type UserLogin = {
  email: string;
  password: string;
};

type UserChangePassword = {
  email: string;
  password: string;
  newPassword: string;
};

type UserForgetPassword = {
  email: string;
};

type UserResetPassword = {
  verificationId: string;
  password: string;
};
