type UserRegister = {
    email: string;
    name: string;
    password: string;
    age: number;
    gender: string;
}

type UserLogin = {
    email: string;
    password: string;
}

type UserChangePassword = {
    email: string;
    password: string;
    newPassword: string;
}