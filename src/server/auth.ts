import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import { db } from "@/server/db";
import { env } from "@/env";
import { verify } from "argon2";
import CredentialsProvider from "next-auth/providers/credentials";
import { schema } from "@/schema";
import { type Role } from "@prisma/client";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: { id: string; role: Role } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user }) => ({ ...token, ...user }),
    session: async ({ session, token }) => ({ ...session, user: { ...session.user, id: token.id, role: token.role } }),
  },
  secret: env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const parsedCredentials = schema.login.safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          const user = await db.user.findFirst({ where: { username } });
          if (!user) return null;
          const passwordsMatch = await verify(user.hashedPassword, password);
          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
