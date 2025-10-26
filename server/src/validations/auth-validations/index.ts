import zod from "zod";

export const LoginValidation = zod.object({
    userEmail: zod.email(),
    password: zod.string(),
});

export const RegisterValidation = zod.object({
    userEmail: zod.email(),
    userName: zod.string(),
    role: zod.string(),
    password: zod.string(),
});
