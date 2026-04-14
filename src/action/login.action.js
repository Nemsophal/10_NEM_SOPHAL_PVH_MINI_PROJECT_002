"use server";

import { loginService } from "@/service/login.service";

export async function signInAction(formData) {
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        await loginService({ email, password });
        return { success: true };
    } catch (error) {
        return { error: error.message || "Invalid email or password." };
    }
}
