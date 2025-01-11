"use client";

import { Button } from "@/components/ui/button";
import { CustomButton } from "@/components/ui/custom/custom-button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createOrganizationInvitationSchema, CreateOrganizationInvitationType } from "@/schemas/organization-invitation.schema";
import { sendOrganizationInvitation } from "@/server/services/organizations.service";
import { fetchOrganizationRoles } from "@/server/services/roles.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface InvitationFormProps {
  organizationId: string;
}

export function InvitationForm({ organizationId }: InvitationFormProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: rolesResponse } = useQuery({
    queryKey: ["organization-roles"],
    queryFn: fetchOrganizationRoles,
  });

  const form = useForm<CreateOrganizationInvitationType>({
    resolver: zodResolver(createOrganizationInvitationSchema),
    defaultValues: {
      email: "",
      roleId: undefined,
    },
  });

  const inviteMutation = useMutation({
    mutationFn: (values: CreateOrganizationInvitationType) => sendOrganizationInvitation(organizationId, values),
    onSuccess: () => {
      toast.success("Invitation envoyée avec succès");
      form.reset();
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["organization-invitations", organizationId],
      });
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de l'envoi de l'invitation");
    },
  });

  const onSubmit = (values: CreateOrganizationInvitationType) => {
    inviteMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Inviter un membre
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inviter un nouveau membre</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="exemple@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rolesResponse?.data.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CustomButton type="submit" className="w-full" disabled={inviteMutation.isPending} isLoading={inviteMutation.isPending}>
              Envoyer l&apos;invitation
            </CustomButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}