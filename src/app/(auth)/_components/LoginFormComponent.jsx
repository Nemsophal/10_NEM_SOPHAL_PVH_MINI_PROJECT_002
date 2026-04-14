"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";

const LoginSchema = z.object({
    email: z.string().trim().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(1, "Password is required").min(6, "Min 6 characters"),
});

export default function LoginFormComponent() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { data: session, update } = useSession();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = (data) => {
        startTransition(async () => {
            console.log("[LoginForm] Attempting login with:", data.email);
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });
            console.log("[LoginForm] Sign in result:", result);
            if (result?.error) {
                console.error("[LoginForm] Sign in error:", result.error);
                toast.error(result.error || "Invalid email or password.");
                return;
            }
            console.log("[LoginForm] Login successful, calling update()");

            const updatedSession = await update();
            console.log("[LoginForm] Updated session:", updatedSession);

            toast.success("Login successful!");
            setTimeout(() => {
                console.log("[LoginForm] Redirecting to home");
                router.replace("/");
                router.refresh();
            }, 500);
        });
    };

    return (
        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>

            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    {...register("email")}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-lime-400 focus:ring-2"
                    placeholder="you@example.com"
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                    type="password"
                    {...register("password")}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-lime-400 focus:ring-2"
                    placeholder="••••••••"
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-full bg-lime-400 py-3.5 text-sm font-semibold text-gray-900 hover:bg-lime-300"
            >
                {isPending ? "Signing in..." : "Sign in"}
            </button>
        </form>
    );
}
