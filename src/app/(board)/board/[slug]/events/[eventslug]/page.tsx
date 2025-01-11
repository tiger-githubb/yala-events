import { fetchEvent } from "@/server/services/events.service";
import { EventInfo } from "./_components/event-info";

interface EventPageProps {
  params: Promise<{ eventslug: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { eventslug } = await params;
  const eventResponse = await fetchEvent(eventslug);

  if (!eventResponse?.data) {
    return <p>Événement introuvable</p>;
  }

  const event = eventResponse.data;

  return (
    <div className="space-y-8">
      <EventInfo event={event} />
    </div>
  );
}
