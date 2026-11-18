"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useActivities } from "../hooks/useActivities";

interface Activity {
  type: string;
  scheduledAt?: string | null;
  dueDate?: string | null;
  name: string;
  status?: string;
}

interface CalendarEvent {
  date: string;
  title: string;
  color?: string;
}

interface InteractiveCalendarProps {
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
}

// Helper function to format count (9+)
const formatCount = (count: number): string => {
  return count > 9 ? '9+' : String(count);
};

// --- POPUP CARD COMPONENT ---
interface EventPopoverProps {
  events: CalendarEvent[];
  position: { top: number; left: number };
}

const EventPopover: React.FC<EventPopoverProps> = ({ events, position }) => {
  const colorMap: Record<string, string> = {
    green: "#10B981", // Scheduled
    warning: "#F97316", // Event
    danger: "#EF4444", // Due
  };

  if (events.length === 0) return null;

  const totalScheduled = events.filter((e) => e.color === "green").length;
  const totalEvents = events.filter((e) => e.color === "warning").length;
  const totalDue = events.filter((e) => e.color === "danger").length;

  return (
    <div
      style={{
        position: "absolute",
        top: position.top + 10,
        left: position.left,
        transform: "translateX(-50%)",
        zIndex: 50,
        backgroundColor: "white",
        borderRadius: "0.5rem",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        border: "1px solid #e5e7eb",
        padding: "0.75rem",
        width: "180px",
      }}
    >
      <p style={{ fontWeight: "600", fontSize: "0.875rem", marginBottom: "0.5rem", color: "#374151" }}>
        {events.length} Activities
      </p>
      
      {/* Detail Item: Scheduled */}
      {totalScheduled > 0 && (
        <div style={{ display: "flex", alignItems: "center", marginBottom: "0.25rem" }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colorMap.green, marginRight: 6 }} />
          <span style={{ fontSize: "0.75rem", color: "#10B981", fontWeight: 500 }}>
            {formatCount(totalScheduled)} Scheduled Tasks
          </span>
        </div>
      )}

      {/* Detail Item: Events */}
      {totalEvents > 0 && (
        <div style={{ display: "flex", alignItems: "center", marginBottom: "0.25rem" }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colorMap.warning, marginRight: 6 }} />
          <span style={{ fontSize: "0.75rem", color: "#F97316", fontWeight: 500 }}>
            {formatCount(totalEvents)} Events
          </span>
        </div>
      )}

      {/* Detail Item: Due Tasks */}
      {totalDue > 0 && (
        <div style={{ display: "flex", alignItems: "center", marginBottom: "0.25rem" }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colorMap.danger, marginRight: 6 }} />
          <span style={{ fontSize: "0.75rem", color: "#EF4444", fontWeight: 500 }}>
            {formatCount(totalDue)} Tasks Due
          </span>
        </div>
      )}
    </div>
  );
};


// --- MAIN CALENDAR COMPONENT ---

export default function InteractiveCalendar({
  events = [],
  onDateSelect,
}: InteractiveCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const [hoveredDayEvents, setHoveredDayEvents] = useState<CalendarEvent[]>([]);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  const { data: activities } = useActivities() as { data: Activity[] | undefined };

  const normalize = (d?: string | null) => {
    if (!d) return "";
    const parsed = new Date(d);
    if (isNaN(parsed.getTime())) return "";
    return `${parsed.getFullYear()}-${(parsed.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${parsed.getDate().toString().padStart(2, "0")}`;
  };

  const scheduledTask = activities
    ?.filter((a) => a.type === "scheduledTask")
    .map((a) => ({
      date: normalize(a.scheduledAt),
      title: a.name,
      color: "green",
    }));

  const eventsActivities = activities
    ?.filter((a) => a.type === "event")
    .map((a) => ({
      date: normalize(a.scheduledAt || a.dueDate),
      title: a.name,
      color: "warning",
    }));

  const Due = activities
    ?.filter((a) => a.status === "pending" && a.type === "task")
    .map((a) => ({
      date: normalize(a.dueDate),
      title: a.name,
      color: "danger",
    }));

  const allEventsByDate = [
    ...(scheduledTask || []),
    ...(eventsActivities || []),
    ...(Due || []),
  ].reduce((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  // Helper functions remain the same
  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateString = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(clickedDate);
    onDateSelect?.(clickedDate);
  };

  // --- HOVER HANDLERS ---
  const handleMouseEnter = (
    dayEvents: CalendarEvent[],
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (dayEvents.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      setHoveredDayEvents(dayEvents);
      setPopoverPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + rect.width / 2,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredDayEvents([]);
    setPopoverPosition({ top: 0, left: 0 });
  };
  // --- END HOVER HANDLERS ---

  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const days = Array.from({ length: 7 }, (_, i) => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames[i];
  });

  const totalDays = daysInMonth(currentDate);
  const firstDay = firstDayOfMonth(currentDate);
  const cells = Array.from({ length: firstDay + totalDays }, (_, i) => {
    if (i < firstDay) return null;
    return i - firstDay + 1;
  });

  // --- START OF RENDER ---
  return (
    <div className="ion-padding">
      <div
        style={{
          width: "100%",
          maxWidth: "28rem",
          borderRadius: "0.5rem",
          border: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
          padding: "1.5rem",
          height: "100%",
          position: "relative",
        }}
      >
        {/* Render the Card Popover */}
        {hoveredDayEvents.length > 0 && (
          <EventPopover events={hoveredDayEvents} position={popoverPosition} />
        )}

        {/* Header (Omitted for brevity, assumed unchanged) */}
        <div
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: "600",
              color: "#000000",
            }}
          >
            {monthYear}
          </h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handlePrevMonth}
              style={{
                borderRadius: "0.5rem",
                padding: "0.5rem",
                backgroundColor: "transparent",
                cursor: "pointer",
                border: "none",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f3f4f6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
              aria-label="Previous month"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextMonth}
              style={{
                borderRadius: "0.5rem",
                padding: "0.5rem",
                backgroundColor: "transparent",
                cursor: "pointer",
                border: "none",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f3f4f6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
              aria-label="Next month"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Day labels (Omitted for brevity, assumed unchanged) */}
        <div
          style={{
            marginBottom: "0.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "0.5rem",
          }}
        >
          {days.map((day) => (
            <div
              key={day}
              style={{
                textAlign: "center",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#6b7280",
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "0.5rem",
            width: "100%",
          }}
        >
          {cells.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} />;
            }

            const currentDateString = `${currentDate.getFullYear()}-${(
              currentDate.getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

            const dayEvents = allEventsByDate[currentDateString] || [];
            const scheduledCount = dayEvents.filter((e) => e.color === "green").length;
            const eventsCount = dayEvents.filter((e) => e.color === "warning").length;
            const dueCount = dayEvents.filter((e) => e.color === "danger").length;

            const isSelected =
              selectedDate &&
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === currentDate.getMonth() &&
              selectedDate.getFullYear() === currentDate.getFullYear();
            const isToday =
              new Date().toDateString() ===
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              ).toDateString();

            const getButtonStyle = () => {
              const baseStyle = {
                width: "100%",
                height: "4rem", // Fixed height
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                transition: "all 0.2s",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ffffff",
                color: "#000000",
                paddingTop: "0.5rem",
                paddingBottom: "0.25rem",
                position: "relative" as const, // Added for absolute positioning of badges
              };

              if (isSelected) {
                return {
                  ...baseStyle,
                  backgroundColor: "#3b82f6",
                  color: "#ffffff",
                };
              } else if (isToday) {
                return {
                  ...baseStyle,
                  border: "2px solid #3b82f6",
                  backgroundColor: "#ffffff",
                };
              }
              return { ...baseStyle, backgroundColor: "#f3f4f6" };
            };

            const Badge: React.FC<{ count: number; color: string; zIndex: number; margin: string }> = 
            ({ count, color, zIndex, margin }) => {
                if (count === 0) return null;
                const displayCount = formatCount(count);

                return (
                    <span
                        style={{
                            minWidth: 16,
                            height: 16,
                            borderRadius: 8,
                            padding: '0 4px',
                            fontSize: 10,
                            lineHeight: '16px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: color,
                            color: isSelected ? color : '#fff', // Badge text color logic
                            fontWeight: 600,
                            position: 'relative',
                            zIndex: zIndex,
                            marginLeft: margin,
                            boxShadow: '0 0 0 1px #fff', // Subtle white border for stacking effect
                            transition: 'background-color 0.2s',
                        }}
                    >
                        {displayCount}
                    </span>
                );
            };

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                onMouseEnter={(e) => handleMouseEnter(dayEvents, e)}
                onMouseLeave={handleMouseLeave}
                style={getButtonStyle()}
                onFocus={(e) => {
                  if (!isSelected && !isToday) {
                    e.currentTarget.style.backgroundColor = "#e5e7eb";
                  }
                }}
                onBlur={(e) => {
                  if (!isSelected && !isToday) {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                  }
                }}
                aria-label={`Select ${day}`}
              >
                {/* Day Number */}
                <span
                  style={{
                    color: isSelected
                      ? "#fff"
                      : isToday
                      ? "#3b82f6"
                      : "#000000",
                    marginBottom: 4,
                  }}
                >
                  {day}
                </span>

                {/* Event Indicators (Count Badges) - FIXED SIZE CONTAINER */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        // This fixed height prevents the button from resizing based on badge content
                        height: "18px", 
                        minHeight: "18px",
                        overflow: 'hidden', // Hide any potential overflow
                        padding: '0 4px' // Padding for visual spacing
                    }}
                >
                    {/* The first badge has no negative margin */}
                    <Badge count={scheduledCount} color="#10B981" zIndex={3} margin="0" />
                    {/* Subsequent badges use negative margin for stacking effect */}
                    <Badge count={eventsCount} color="#F97316" zIndex={2} margin={scheduledCount > 0 ? "-4px" : "0"} />
                    <Badge count={dueCount} color="#EF4444" zIndex={1} margin={eventsCount > 0 || scheduledCount > 0 ? "-4px" : "0"} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Event details (Selected Day) - Assumed unchanged */}
        {selectedDate && allEventsByDate[formatDateString(selectedDate)] && (
          <div
            style={{
              marginTop: "1.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              backgroundColor: "#f3f4f6",
              padding: "1rem",
            }}
          >
            {allEventsByDate[formatDateString(selectedDate)].map((event, i) => (
              <div
                key={i}
                style={{
                  marginBottom:
                    i <
                    allEventsByDate[formatDateString(selectedDate)].length - 1
                      ? 4
                      : 0,
                }}
              >
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#000000",
                  }}
                >
                  {event.title}
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    marginTop: "0.25rem",
                  }}
                >
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}