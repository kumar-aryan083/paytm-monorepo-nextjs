import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone Number", type: "text", placeholder: "123123" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const existingUser = await db.user.findFirst({
          where: {
            number: credentials.phone,
          },
        });
        if (existingUser) {
          const passwordValidation = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );
          if (passwordValidation) {
            return {
              id: existingUser.id,
              name: existingUser.fullName,
              number: existingUser.number,
            };
          } else {
            return null;
          }
        }
        try {
          const user = await db.user.create({
            data: {
              number: credentials.phone,
              password: hashedPassword,
            },
          });
          return {
            id: user.id,
            name: user.fullName,
            number: user.number,
          };
        } catch (e) {
          console.error(e);
        }
        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "",
  callbacks: {
    async session({ session, token }: any) {
      session.user.id = token.sub;
      return session;
    },
  },
  //   pages: {
  //     signIn: "/signin",
  //   },
};
