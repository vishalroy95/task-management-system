"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Input } from "@/components/ui";
import { notify } from "@/lib/toast";

type FormErrors = {
  email?: string;
  password?: string;
};

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email or username is required.";
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required.";
    }

    return nextErrors;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    notify.success("Signed in successfully.");
    router.push("/");
  }

  function handleGuestLogin() {
    notify.info("Continuing as guest.");
    router.push("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4 sm:p-6 lg:p-8 dark:bg-slate-950">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
        <div className="grid lg:grid-cols-[1.02fr_1.18fr]">
          <div className="relative hidden min-h-[640px] overflow-hidden bg-slate-950 p-8 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.26),transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.28),transparent_38%)]" />
            <div className="relative flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm">
                <span className="text-sm font-semibold tracking-[0.22em] text-sky-200">
                  AG
                </span>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-300">
                  Ag Workspace
                </p>
              </div>
            </div>

            <div className="relative max-w-md">
              <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-sky-100 backdrop-blur-sm">
                Team productivity hub
              </div>
              <h1 className="mt-6 text-4xl font-semibold leading-tight text-white">
                Welcome back to your workflow.
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-300">
                Keep projects moving, track priorities, and collaborate with your team in one place.
              </p>
            </div>

            <div className="relative grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-3xl font-semibold text-white">12</p>
                <p className="mt-1 text-sm text-slate-300">Active projects</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-3xl font-semibold text-white">48</p>
                <p className="mt-1 text-sm text-slate-300">Tasks in motion</p>
              </div>
            </div>
          </div>

          <div className="bg-surface p-6 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Welcome back
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Sign in
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Use your work email to access your workspace.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-foreground">
                    Email or username
                  </span>
                  <Input
                    autoComplete="username"
                    className="h-12 rounded-lg border-border px-3.5 text-sm shadow-xs"
                    isInvalid={Boolean(errors.email)}
                    name="emailOrUsername"
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (errors.email) {
                        setErrors((current) => ({ ...current, email: undefined }));
                      }
                    }}
                    placeholder="name@company.com or username"
                    type="text"
                    value={email}
                  />
                  {errors.email ? (
                    <span className="text-sm text-danger">{errors.email}</span>
                  ) : null}
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-foreground">Password</span>
                  <div className="relative">
                    <Input
                      autoComplete="current-password"
                      className="h-12 rounded-lg border-border px-3.5 pr-11 text-sm shadow-xs"
                      isInvalid={Boolean(errors.password)}
                      name="password"
                      onChange={(event) => {
                        setPassword(event.target.value);
                        if (errors.password) {
                          setErrors((current) => ({ ...current, password: undefined }));
                        }
                      }}
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                    />
                    <button
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-3 flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setShowPassword((current) => !current)}
                      type="button"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password ? (
                    <span className="text-sm text-danger">{errors.password}</span>
                  ) : null}
                </label>

                <div className="flex items-center justify-between gap-3">
                  <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      checked={rememberMe}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      name="rememberMe"
                      onChange={(event) => setRememberMe(event.target.checked)}
                      type="checkbox"
                    />
                    Remember me
                  </label>

                  <button
                    className="text-sm font-medium text-primary transition-colors hover:text-primary-hover"
                    type="button"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button className="h-12 w-full rounded-lg text-sm font-medium" size="lg" type="submit">
                  Login
                </Button>

                <Button
                  className="h-12 w-full rounded-lg text-sm font-medium"
                  onClick={handleGuestLogin}
                  size="lg"
                  type="button"
                  variant="secondary"
                >
                  Continue as Guest
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Need access? {" "}
                  <button
                    className="font-medium text-primary transition-colors hover:text-primary-hover"
                    type="button"
                  >
                    Contact your workspace admin
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
