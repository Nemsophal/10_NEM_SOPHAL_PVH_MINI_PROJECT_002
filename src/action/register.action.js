"use server";

import { registerService } from "@/service/register.service";

export async function signUpAction(formData) {
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");
    const birthdate = formData.get("birthdate");

    try {
        await registerService({ firstName, lastName, email, password, birthdate });
        return { success: true };
    } catch (error) {
        return { error: error.message || "Registration failed." };
    }
}
