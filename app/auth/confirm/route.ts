import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const token = searchParams.get("token");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  const supabase = await createClient();

  // Handle PKCE flow (when 'token' is present)
  if (token && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: token, // Use token as token_hash for PKCE
    });
    
    if (!error) {
      redirect(next);
    } else {
      console.error("PKCE verification error:", error);
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
    }
  }
  
  // Handle regular magic link flow (when 'token_hash' is present)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    
    if (!error) {
      redirect(next);
    } else {
      console.error("Magic link verification error:", error);
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
    }
  }

  // If we're here, it means the URL is being accessed directly or incorrectly
  // Try to exchange the code if this is coming from Supabase's redirect
  const code = searchParams.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      redirect(next);
    } else {
      console.error("Code exchange error:", error);
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
    }
  }

  // No valid auth parameters found
  redirect(`/auth/error?error=${encodeURIComponent("Invalid authentication link")}`);
}
