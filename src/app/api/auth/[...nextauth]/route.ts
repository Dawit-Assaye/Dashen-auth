/* eslint-disable @typescript-eslint/no-explicit-any */

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userName: { label: "Username", type: "text" },
        otpToken: { label: "OTP Token", type: "text" },
        pin: { label: "PIN", type: "password" },
      },
      async authorize(credentials) {
        if (
          !credentials?.userName ||
          !credentials?.otpToken ||
          !credentials?.pin
        ) {
          throw new Error("Missing credentials");
        }

        try {
          const loginResponse = await axios.post(
            "https://sau.eaglelionsystems.com/v1.0/chatbirrapi/cpsauth/user/login",
            { password: credentials.pin },
            {
              headers: {
                sourceapp: "dashportal",
                Authorization: `Bearer ${credentials.otpToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (loginResponse.data.statusCode !== 200) {
            throw new Error(loginResponse.data.message || "Login failed");
          }

          const user = {
            id: loginResponse.data.data.user_id,
            userName: credentials.userName,
            email: loginResponse.data.data.email,
            token: loginResponse.data.data.accesstoken,
            fullName: loginResponse.data.data.full_name,
            userRole: loginResponse.data.data.user_role,
            phoneNumber: loginResponse.data.data.phone_number,
          };
          return user;
        } catch (error: any) {
          throw new Error(
            error.response?.data?.message || "Authentication failed"
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.phoneNumber = user.phoneNumber;
        token.authToken = user.token;
        token.fullName = user.fullName;
        token.userRole = user.userRole;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          phoneNumber: token.phoneNumber as string,
          token: token.authToken as string,
          fullName: token.fullName as string,
          userRole: token.userRole as string,
          email: token.email as string,
        },
      };
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
