import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "./prisma";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql",  "sqlite", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },

      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.URL}/verify-email/?token=${token}`;

        const info = await transporter.sendMail({
          from: '"Prisma blog" <prismablog@salauddin.com>',
          to: user.email,
          subject: "Please verify your email",
          html: `
              <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Email Verification</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              background: #ffffff;
              padding: 24px;
              border-radius: 8px;
            }
            .button {
              display: inline-block;
              margin-top: 20px;
              padding: 12px 20px;
              background-color: #2563eb;
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Hello ${user.name}</h2>

            <p>
              Thank you for signing up. Please verify your email address by clicking
              the button below.
            </p>

            <a href="${verificationUrl}" class="button">
              Verify Email
            </a>
            <a>
              href="${url}" 
            </a> 

            <p>
              This verification link will expire in <strong>10 minutes</strong>.
            </p>

            <p>
              If you did not create an account, you can safely ignore this email.
            </p>

            <div class="footer">
              <p>© ${new Date().getFullYear()} Prisma Blog</p>
            </div>
          </div>
        </body>
      </html>`, // HTML version of the message
        });

        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
