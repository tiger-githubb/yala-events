"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTicketSchema, CreateTicketType } from "@/schemas/event-ticket.schema";
import { fetchEventTicketTypes } from "@/server/services/events-tickets-types.service";
import { createEventTicket } from "@/server/services/events-tickets.service";
import { resolveSlug } from "@/server/services/slug-resolver.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface TicketGenerationFormProps {
  organizationSlug: string;
  eventSlug: string;
}

export default function TicketGenerationForm({ organizationSlug, eventSlug }: TicketGenerationFormProps) {
  const queryClient = useQueryClient();
  const [organizationId, setOrganizationId] = useState<number | null>(null);
  const [eventId, setEventId] = useState<number | null>(null);
  const t = useTranslations("tickets.ticketGenerationForm");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateTicketType>({
    resolver: zodResolver(createTicketSchema((t) => t)),
  });

  // Resolve slugs to IDs
  useEffect(() => {
    const resolveIds = async () => {
      try {
        const orgId = await resolveSlug("organization", organizationSlug);
        const evtId = await resolveSlug("event", eventSlug);
        setOrganizationId(orgId);
        setEventId(evtId);
      } catch {
        toast.error("Erreur lors de la résolution des slugs.");
      }
    };
    resolveIds();
  }, [organizationSlug, eventSlug]);

  // Fetch ticket types
  const { data: eventTicketType, isLoading: isLoadingTicketTypes } = useQuery({
    queryKey: ["event-ticket-types"],
    queryFn: fetchEventTicketTypes,
  });

  const mutation = useMutation({
    mutationFn: (formData: CreateTicketType) => {
      if (organizationId && eventId) {
        const formDataWithNulls = {
          ...formData,
          saleStartDate: formData.saleStartDate ?? null,
          saleStartTime: formData.saleStartTime ?? null,
          saleEndDate: formData.saleEndDate ?? null,
          saleEndTime: formData.saleEndTime ?? null,
        };
        return createEventTicket(organizationId.toString(), eventId.toString(), formDataWithNulls);
      }
      throw new Error("IDs manquants pour la création du ticket.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-tickets", organizationSlug, eventSlug] });
      toast.success(t("ticketCreated"));
      reset();
    },
    onError: () => {
      toast.error(t("ticketError"));
    },
  });

  const onSubmit = (data: CreateTicketType) => {
    if (!organizationId || !eventId) {
      toast.error("Les IDs d'organisation ou d'événement ne sont pas disponibles.");
      return;
    }
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("name")} placeholder={t("ticketName")} required aria-invalid={!!errors.name} />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <textarea
        {...register("description")}
        placeholder={t("ticketDescription")}
        rows={4}
        required
        className="w-full p-2 border rounded-md"
        aria-invalid={!!errors.description}
      />
      {errors.description && <p className="text-red-500">{errors.description.message}</p>}

      <Input
        {...register("price", { valueAsNumber: true })}
        type="number"
        placeholder={t("ticketPrice")}
        required
        aria-invalid={!!errors.price}
      />
      {errors.price && <p className="text-red-500">{errors.price.message}</p>}

      <Input
        {...register("availableQuantity", { valueAsNumber: true })}
        type="number"
        placeholder={t("ticketQuantity")}
        required
        aria-invalid={!!errors.availableQuantity}
      />
      {errors.availableQuantity && <p className="text-red-500">{errors.availableQuantity.message}</p>}

      <Input
        {...register("minTicketsPerOrder", { valueAsNumber: true })}
        type="number"
        placeholder={t("ticketMinQuantity")}
        required
        aria-invalid={!!errors.minTicketsPerOrder}
      />
      {errors.minTicketsPerOrder && <p className="text-red-500">{errors.minTicketsPerOrder.message}</p>}

      <Input
        {...register("maxTicketsPerOrder", { valueAsNumber: true })}
        type="number"
        placeholder={t("ticketMaxQuantity")}
        required
        aria-invalid={!!errors.maxTicketsPerOrder}
      />
      {errors.maxTicketsPerOrder && <p className="text-red-500">{errors.maxTicketsPerOrder.message}</p>}

      <div className="flex gap-4">
        <Input {...register("saleStartDate")} type="date" placeholder={t("ticketSaleStartDate")} />
        <Input {...register("saleStartTime")} type="time" placeholder={t("ticketSaleStartTime")} />
      </div>

      <div className="flex gap-4">
        <Input {...register("saleEndDate")} type="date" placeholder={t("ticketSaleEndDate")} />
        <Input {...register("saleEndTime")} type="time" placeholder={t("ticketSaleEndTime")} />
      </div>

      <div>
        <Select
          onValueChange={(value) => setValue("ticketTypeId", parseInt(value))}
          defaultValue={isLoadingTicketTypes || !eventTicketType ? "" : eventTicketType.data[0]?.id.toString()}
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue placeholder={t("ticketType")} />
          </SelectTrigger>
          <SelectContent>
            {isLoadingTicketTypes ? (
              <SelectItem value="Chargement des types..." disabled>
                {t("loadingTicketTypes")}
              </SelectItem>
            ) : (
              eventTicketType?.data.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.ticketTypeId && <p className="text-red-500">{errors.ticketTypeId.message}</p>}
      </div>

      <Button type="submit" disabled={mutation.status === "pending" || !organizationId || !eventId}>
        {mutation.status === "pending" ? "Création en cours..." : t("createTicketButton")}
      </Button>
    </form>
  );
}
