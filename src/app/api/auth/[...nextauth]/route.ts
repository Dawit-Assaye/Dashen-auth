import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phoneNumber: { label: "Phone Number", type: "text" },
        otpToken: { label: "OTP Token", type: "text" },
        pin: { label: "PIN", type: "password" },
      },
      async authorize(credentials) {
        if (
          !credentials?.phoneNumber ||
          !credentials?.otpToken ||
          !credentials?.pin
        ) {
          throw new Error("Missing credentials");
        }

        try {
          // Step 3: Login with PIN using the OTP token
          const loginResponse = await axios.post(
            "https://sau.eaglelionsystems.com/v1.0/chatbirrapi/cpsauth/user/login",
            { password: credentials.pin },
            {
              headers: {
                sourceapp: "dashportal",
                Authorization: `Bearer ${credentials.otpToken}`,
              },
            }
          );

          const user = {
            id: credentials.phoneNumber, // Use phone number as the user ID
            token: loginResponse.data.token,
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
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.authToken = user.token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id as string;
      session.user.token = token.authToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});

export { handler as GET, handler as POST };
