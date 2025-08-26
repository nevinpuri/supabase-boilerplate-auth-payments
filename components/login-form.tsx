"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/protected`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsMagicLinkLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=/protected`,
        },
      });

      if (error) throw error;
      
      setMagicLinkSent(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome!</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          {!showEmailForm ? (
            <>
              <form onSubmit={handleSocialLogin}>
                <div className="flex flex-col gap-6">
                  {error && (
                    <div className="rounded-md bg-destructive/10 p-3">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Continue with Google"
                      )}
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowEmailForm(true)}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Email Magic Link
                    </Button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <>
              {!magicLinkSent ? (
                <form onSubmit={handleMagicLink}>
                  <div className="flex flex-col gap-4">
                    {error && (
                      <div className="rounded-md bg-destructive/10 p-3">
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isMagicLinkLoading}
                      />
                      <p className="text-xs text-muted-foreground">
                        We'll send you a magic link to sign in
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isMagicLinkLoading || !email}
                      >
                        {isMagicLinkLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending magic link...
                          </>
                        ) : (
                          "Send Magic Link"
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          setShowEmailForm(false);
                          setError(null);
                          setEmail("");
                        }}
                        disabled={isMagicLinkLoading}
                      >
                        Back to login options
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-4 text-center">
                  <div className="rounded-md bg-green-500/10 dark:bg-green-500/20 p-4 border border-green-500/20">
                    <h3 className="font-medium text-green-600 dark:text-green-400">
                      Check your email!
                    </h3>
                    <p className="mt-2 text-sm text-green-600/90 dark:text-green-400/90">
                      We've sent a magic link to <strong>{email}</strong>
                    </p>
                    <p className="mt-1 text-xs text-green-600/70 dark:text-green-400/70">
                      Click the link in your email to sign in
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setMagicLinkSent(false);
                        setEmail("");
                      }}
                    >
                      Use a different email
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        setShowEmailForm(false);
                        setMagicLinkSent(false);
                        setError(null);
                        setEmail("");
                      }}
                    >
                      Back to login options
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}