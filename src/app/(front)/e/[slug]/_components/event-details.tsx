import { Event } from "@/types/api/event.type";
import { EventHeader } from "./event-header";
import { EventInfo } from "./event-info";
import { EventSidebar } from "./event-sidebar";

interface EventDetailsProps {
  event: Event;
}

export function EventDetails({ event }: EventDetailsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <EventHeader event={event} />
        <EventInfo event={event} />
      </div>
      <div className="lg:col-span-1">
        <EventSidebar event={event} />
      </div>
    </div>
  );
}
