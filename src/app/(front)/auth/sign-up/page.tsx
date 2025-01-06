import { routes } from "@/config/routes";

import { signInSlides } from "@/config/constants";
import { Metadata } from "next";
import { AuthWrapper } from "../_components/auth-wrapper";
import { SignUpForm } from "./_components/sign-up-form";

export const metadata: Metadata = {
  title: "Inscription | Evely",
  description: "Connectez-vous à votre compte Evely pour gérer vos événements au Togo.",
};

export default function AuthenticationPage() {
  return (
    <AuthWrapper
      title="Inscription"
      description="Créez un compte Evely pour gérer vos événements."
      linkText="Connexion"
      linkHref={routes.auth.signIn}
      slides={signInSlides}
    >
      <SignUpForm />
    </AuthWrapper>
  );
}