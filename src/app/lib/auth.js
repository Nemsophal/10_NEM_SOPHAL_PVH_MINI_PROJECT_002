import Credentials from "next-auth/providers/credentials";
import { loginService } from "@/service/login.service";

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                try {
                    const token = await loginService({
                        email: credentials.email,
                        password: credentials.password,
                    });

                    return {
                        id: credentials.email,
                        email: credentials.email,
                        accessToken: token,
                    };
                } catch (error) {
                    console.error("[Auth] Authorize error:", error);
                    return null;
                }
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.email = user.email;
                token.name = user.name;
                token.lastName = user.lastName;
                token.image = user.image;
                token.role = user.role;
            }
            return token;
        },

        async session({ session, token }) {
            session.user.email = token.email;
            session.user.name = token.name;
            session.user.firstName = token.firstName;
            session.user.accessToken = token.accessToken;
            return session;
        },
    },

    pages: {
        signIn: "/login",
        error: "/login",
    },
};
