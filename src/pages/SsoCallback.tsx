import { AuthenticateWithRedirectCallback } from '@clerk/react';

export function SsoCallback() {
  return (
    <div className="pt-32 min-h-screen flex items-center justify-center bg-background">
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
