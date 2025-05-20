
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@3.4.0"; // Using a recent version of resend

// Initialize Resend with the API key from environment variables
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const ADMIN_EMAIL = "enquiry@dumblabs.ai"; // Your email address - UPDATED

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!resend) {
    console.error("Resend API key is not configured.");
    return new Response(JSON.stringify({ error: "Email service is not configured." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const data: ContactFormData = await req.json();
    console.log("[send-contact-email] Received data:", data);

    // Email to Admin
    const adminEmailResult = await resend.emails.send({
      from: "DumbLabs.AI Contact Form <hello@dumblabs.ai>", // Updated from address
      to: ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${data.subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      `,
    });
    console.log("[send-contact-email] Admin email sent:", adminEmailResult);

    // Confirmation Email to User
    const userEmailResult = await resend.emails.send({
      from: "DumbLabs.AI <hello@dumblabs.ai>", // Updated from address
      to: data.email,
      subject: "We've received your message!",
      html: `
        <h1>Thank You, ${data.name}!</h1>
        <p>We've received your message titled "<strong>${data.subject}</strong>" and will get back to you as soon as possible.</p>
        <p>Best regards,<br>The DumbLabs.AI Team</p>
      `,
    });
    console.log("[send-contact-email] User confirmation email sent:", userEmailResult);

    if (adminEmailResult.error || userEmailResult.error) {
        console.error("[send-contact-email] Error sending email(s):", adminEmailResult.error, userEmailResult.error);
        // Propagate the error message from Resend if available
        const adminErrorMessage = adminEmailResult.error ? adminEmailResult.error.message : "Unknown error";
        const userErrorMessage = userEmailResult.error ? userEmailResult.error.message : "Unknown error";
        throw new Error(`Failed to send one or more emails. Admin: ${adminErrorMessage}, User: ${userErrorMessage}`);
    }

    return new Response(JSON.stringify({ message: "Emails sent successfully!" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[send-contact-email] Error:", error);
    return new Response(JSON.stringify({ error: error.message || "An unknown error occurred." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
