"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerService } from "@/service/register.service";

const RegisterSchema = z.object({
  name: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required").min(6, "Min 6 characters"),
  birthdate: z.string().min(1, "Birthdate is required"),
});

export default function RegisterFormComponent() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "", birthdate: "" },
  });

  const onSubmit = (data) => {
    startTransition(async () => {
      try {
        const [firstName, ...rest] = data.name.trim().split(" ");
        const lastName = rest.join(" ") || "";
        await registerService({
          firstName,
          lastName,
          email: data.email,
          password: data.password,
          birthdate: data.birthdate,
        });
        toast.success("Account created! Please log in.");
        router.push("/login");
      } catch (error) {
        toast.error(error.message || "Registration failed.");
      }
    });
  };

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label className="block text-sm font-medium text-gray-700">Full name</label>
        <input
          type="text"
          {...register("name")}
          placeholder="Jane Doe"
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email")}
          placeholder="you@example.com"
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          {...register("password")}
          placeholder="••••••••"
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
        />
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Birthdate</label>
        <input
          type="date"
          {...register("birthdate")}
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
        />
        {errors.birthdate && <p className="text-sm text-red-500 mt-1">{errors.birthdate.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-lime-400 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-lime-300"
      >
        {isPending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
