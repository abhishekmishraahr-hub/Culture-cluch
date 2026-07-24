import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import * as bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email/employee ID or password");
        }

        // Query user by email or employeeId
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.email },
              { employeeId: credentials.email }
            ]
          },
          include: { role: true }
        });

        if (!user) {
          throw new Error("Account not found");
        }

        // Check if account is suspended
        if (user.isSuspended) {
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              actorName: user.name,
              action: "FAILED_LOGIN",
              details: `Blocked login attempt: Suspended employee ${user.employeeId || user.email}.`
            }
          });
          throw new Error("Account suspended. Profile locked.");
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!passwordMatch) {
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              actorName: user.name,
              action: "FAILED_LOGIN",
              details: `Failed login attempt (incorrect password) for account: ${credentials.email}`
            }
          });
          throw new Error("Invalid password");
        }

        // Log successful login
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            actorName: user.name,
            action: "LOGIN",
            details: `Employee ${user.employeeId || user.email} logged in successfully.`
          }
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          role: user.role.name,
          permissions: user.role.permissions,
          department: user.department || "",
          employeeId: user.employeeId || "",
          designation: user.designation || ""
        };
      }
    }),
    CredentialsProvider({
      id: "otp",
      name: "OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        code: { label: "OTP Code", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.code) {
          throw new Error("Missing phone or code");
        }

        // Mock verification: accept '123456' for any valid phone
        if (credentials.code !== "123456") {
          throw new Error("Invalid OTP code");
        }

        const user = await prisma.user.findFirst({
          where: { phone: credentials.phone },
          include: { role: true }
        });

        if (!user || user.isSuspended) {
          throw new Error("No active account found with this phone number");
        }

        // Log successful OTP login
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            actorName: user.name,
            action: "LOGIN",
            details: `User ${user.name} logged in via OTP authentication.`
          }
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          role: user.role.name,
          permissions: user.role.permissions,
          department: user.department || "",
          employeeId: user.employeeId || "",
          designation: user.designation || ""
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.permissions = (user as any).permissions;
        token.department = (user as any).department;
        token.employeeId = (user as any).employeeId;
        token.designation = (user as any).designation;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).permissions = token.permissions;
        (session.user as any).department = token.department;
        (session.user as any).employeeId = token.employeeId;
        (session.user as any).designation = token.designation;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET || "your-development-nextauth-secret-key-auraic-2026",
  pages: {
    signIn: "/login"
  },
  debug: true
};
