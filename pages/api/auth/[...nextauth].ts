import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Dummy check – replace with real logic
        if (credentials?.email === "admin@luxury.com" && credentials?.password === "admin123") {
          return { id: "1", name: "Admin", email: "admin@luxury.com", role: "admin" };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "luxurycrm-secret",
});

export { handler as GET, handler as POST };
