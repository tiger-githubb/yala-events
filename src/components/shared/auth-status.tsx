"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routes } from "@/config/routes";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const AuthStatus = () => {
  const { data: session } = useSession();
  const t = useTranslations("AuthentificationStatus");

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex justify-end gap-2">
      <div className="border-r hidden md:inline"></div>
      {session?.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback>{getUserInitials(session.user.name || t("userFallback"))}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={routes.board.dashboard}>{t("dashboard")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={routes.board.profile}>{t("profile")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={routes.board.mytickets}>{t("myEvents")}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>{t("signOut")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Link href={routes.auth.signIn} className="hidden md:block">
            <Button variant="outline" size={"default"}>
              {t("signIn")}
            </Button>
          </Link>
          <Link href={routes.auth.signUp}>
            <Button size={"default"}>{t("signUp")}</Button>
          </Link>
        </>
      )}
    </div>
  );
};
