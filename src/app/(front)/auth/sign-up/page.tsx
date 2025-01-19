import { routes } from "@/config/routes";

import { Metadata } from "next";
import { AuthWrapper } from "../_components/auth-wrapper";
import { SignUpForm } from "./_components/sign-up-form";

export const metadata: Metadata = {
  title: "Inscription | Yala",
  description: "Connectez-vous à votre compte Yala pour gérer vos événements au Togo.",
};

export default function AuthenticationPage() {
  return (
    <AuthWrapper
      titleKey="signUpTitle"
      descriptionKey="signUpDescription"
      linkTextKey="signInLinkText"
      linkHref={routes.auth.signIn}
      slides={[
        {
          quote: "Experience the best events in Africa!",
          author: "Afrique Event",
          image: "/images/sliders/afrique-event.jpg",
        },
        {
          quote: "Celebrate the best moments.",
          author: "Event Fête",
          image: "/images/sliders/evenement-fete.jpeg",
        },
        {
          quote: "Fashion and elegance redefined.",
          author: "Mode Event",
          image: "/images/sliders/evenement-mode.jpeg",
        },
        {
          quote: "Unite for a festive celebration.",
          author: "Women's Fiesta",
          image: "/images/sliders/women-fiesta.jpg",
        },
      ]}
      showLegalNotice={true}
    >
      <SignUpForm />
    </AuthWrapper>
  );
}
