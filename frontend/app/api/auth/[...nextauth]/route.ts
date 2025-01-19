import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { apiClient } from '@/lib/api/client';
import { JWT } from 'next-auth/jwt';

// Extend the built-in session type
interface ExtendedSession extends DefaultSession {
  accessToken?: string;
}

// Extend the built-in user type
interface ExtendedUser extends DefaultUser {
  token?: string;
}

// Extend the built-in JWT type
interface ExtendedJWT {
  accessToken?: string;
}

declare module "next-auth" {
  interface Session extends ExtendedSession {}
  interface User extends ExtendedUser {}
}

declare module "next-auth/jwt" {
  interface JWT extends ExtendedJWT {}
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const response = await apiClient.post('/auth/login', {
            email: credentials?.email,
            password: credentials?.password,
          });

          const { user, token } = response.data;

          if (user && token) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              token,
            };
          }
          return null;
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: ExtendedUser }) {
      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }: { session: ExtendedSession; token: JWT }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };