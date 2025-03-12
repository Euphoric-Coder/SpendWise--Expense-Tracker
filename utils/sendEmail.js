"use server";

import { Resend } from "resend";

export async function sendEmail({ from, to, subject, replyTo, react }) {
  const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

  try {
    if (to !== process.env.NEXT_PUBLIC_TEST_USER_EMAIL) {
      const data = await resend.emails.send({
        from,
        to,
        replyTo,
        subject,
        react,
      });
      return { success: true, data };
    } else {
      console.log("Email not sent to test user");
      return { success: true };
    }
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
