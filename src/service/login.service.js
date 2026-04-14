export async function loginService({email, password}){
const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/auths/login`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
});

const data = await res.json();

if (!res.ok) {
    throw new Error(data.detail || "Login failed");
}

return data.payload.token;
}
