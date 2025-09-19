"use client";

import { SessionProvider } from "next-auth/react";
import AuthSync from "./AuthSync";

interface ClientAuthWrapperProps {
  children: React.ReactNode;
}

const ClientAuthWrapper: React.FC<ClientAuthWrapperProps> = ({ children }) => {
  return (
    <SessionProvider>
      <AuthSync />
      {children}
    </SessionProvider>
  );
};

export default ClientAuthWrapper;
