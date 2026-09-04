"use client";

import { FormEvent, useState } from "react";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

type AuthPanelProps = {
  auth: {
    signIn: {
      email: (values: { email: string; password: string }) => Promise<unknown>;
    };
    signUp: {
      email: (values: {
        email: string;
        password: string;
        name: string;
      }) => Promise<unknown>;
    };
    signOut: () => Promise<unknown>;
  };
  user?: {
    email?: string | null;
    name?: string | null;
  } | null;
};

function getAuthError(result: unknown) {
  if (
    result &&
    typeof result === "object" &&
    "error" in result &&
    result.error &&
    typeof result.error === "object" &&
    "message" in result.error
  ) {
    return String(result.error.message);
  }

  return null;
}

export function AuthPanel({ auth, user }: AuthPanelProps) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setStatus(null);

    try {
      const result =
        mode === "sign-in"
          ? await auth.signIn.email({ email, password })
          : await auth.signUp.email({
              email,
              password,
              name: name.trim() || email,
            });

      const authError = getAuthError(result);
      if (authError) {
        throw new Error(authError);
      }

      setStatus(mode === "sign-in" ? "Signed in." : "Account created.");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    setError(null);
    setStatus(null);

    try {
      const result = await auth.signOut();
      const authError = getAuthError(result);
      if (authError) {
        throw new Error(authError);
      }
      setStatus("Signed out.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign out failed.");
    } finally {
      setBusy(false);
    }
  }

  if (user) {
    return (
      <section className="rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              Signed in as {user.name || user.email || "your account"}
            </p>
            <p className="text-sm text-muted-foreground">
              Your contacts are protected by Neon Row Level Security.
            </p>
          </div>
          <Button type="button" variant="secondary" onClick={signOut} disabled={busy}>
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Sign out
          </Button>
        </div>
        {status ? <p className="mt-3 text-sm text-teal-700">{status}</p> : null}
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      </section>
    );
  }

  return (
    <section className="rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex rounded-[var(--radius)] border border-border bg-muted p-1">
        <Button
          type="button"
          variant={mode === "sign-in" ? "primary" : "ghost"}
          className="flex-1"
          onClick={() => setMode("sign-in")}
        >
          <LogIn aria-hidden="true" className="h-4 w-4" />
          Sign in
        </Button>
        <Button
          type="button"
          variant={mode === "sign-up" ? "primary" : "ghost"}
          className="flex-1"
          onClick={() => setMode("sign-up")}
        >
          <UserPlus aria-hidden="true" className="h-4 w-4" />
          Sign up
        </Button>
      </div>

      <form className="grid gap-4" onSubmit={submit}>
        {mode === "sign-up" ? (
          <div className="grid gap-2">
            <Label htmlFor="auth-name">Name</Label>
            <Input
              id="auth-name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Grace Hopper"
            />
          </div>
        ) : null}
        <div className="grid gap-2">
          <Label htmlFor="auth-email">Email</Label>
          <Input
            id="auth-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@berkeley.edu"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="auth-password">Password</Label>
          <Input
            id="auth-password"
            type="password"
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
          />
        </div>
        <Button type="submit" disabled={busy}>
          {mode === "sign-in" ? (
            <LogIn aria-hidden="true" className="h-4 w-4" />
          ) : (
            <UserPlus aria-hidden="true" className="h-4 w-4" />
          )}
          {busy ? "Working..." : mode === "sign-in" ? "Sign in" : "Create account"}
        </Button>
      </form>
      {status ? <p className="mt-3 text-sm text-teal-700">{status}</p> : null}
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
