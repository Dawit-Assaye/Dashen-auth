import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      email: string;
      phoneNumber: string;
      authToken: string;
      fullName: string;
      userRole: string;
      // Add other custom user properties here
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    phoneNumber?: string;
    authToken?: string;
    fullName?: string;
    userRole?: string;
    // Add other custom user properties here
  }
}
