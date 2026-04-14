export async function registerService({ firstName, lastName, email, password, birthdate }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL || process.env.AUTH_API_URL}/auths/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstName, lastName, email, password, birthdate }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || data.message || data.error || "Registration failed");
  }
  return data;
}
