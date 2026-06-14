import React from 'react';
import {
  ClerkProvider,
  useAuth as useClerkAuth,
  useUser as useClerkUser,
  SignInButton as ClerkSignInButton,
  UserButton as ClerkUserButton,
  SignedIn as ClerkSignedIn,
  SignedOut as ClerkSignedOut,
} from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error(
    'Missing VITE_CLERK_PUBLISHABLE_KEY in your .env file'
  );
}

export function AppAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      signInFallbackRedirectUrl="/dashboard"
      signInForceRedirectUrl="/dashboard"
    >
      {children}
    </ClerkProvider>
  );
}

export function useAuth() {
  return useClerkAuth();
}

export function useUser() {
  return useClerkUser();
}

export function SignedIn({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkSignedIn>{children}</ClerkSignedIn>;
}

export function SignedOut({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkSignedOut>{children}</ClerkSignedOut>;
}

export function SignInButton({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode?: 'modal' | 'redirect';
}) {
  return (
    <ClerkSignInButton
      mode={mode}
      forceRedirectUrl="/dashboard"
    >
      {children}
    </ClerkSignInButton>
  );
}

export function UserButton({
  afterSignOutUrl,
  appearance,
}: any) {
  return (
    <ClerkUserButton
      afterSignOutUrl={afterSignOutUrl}
      appearance={appearance}
    />
  );
}