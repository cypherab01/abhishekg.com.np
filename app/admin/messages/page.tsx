import Link from "next/link";
import { Mail, MailOpen } from "lucide-react";
import { getMessages } from "@/db/queries";
import { toggleMessageRead, deleteMessage } from "../actions";
import { DeleteButton } from "../_components/delete-button";
import { PageHeader, Pill } from "../_components/ui";
import { cn } from "@/lib/utils";

type MessageFilter = "all" | "unread" | "read";

function normalizeFilter(value?: string): MessageFilter {
  return value === "unread" || value === "read" ? value : "all";
}

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const [{ tab }, messages] = await Promise.all([searchParams, getMessages()]);
  const activeTab = normalizeFilter(tab);
  const unreadCount = messages.filter((msg) => !msg.read).length;
  const readCount = messages.length - unreadCount;

  const visibleMessages = messages.filter((msg) => {
    if (activeTab === "unread") return !msg.read;
    if (activeTab === "read") return msg.read;
    return true;
  });

  const tabs = [
    { label: "All", value: "all" as const, count: messages.length },
    { label: "Unread", value: "unread" as const, count: unreadCount },
    { label: "Read", value: "read" as const, count: readCount },
  ];

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Submissions from the contact form."
      />

      <div className="mb-6 inline-flex flex-wrap gap-1 rounded-xl border border-border bg-muted/40 p-1">
        {tabs.map((tabItem) => {
          const active = activeTab === tabItem.value;
          return (
            <Link
              key={tabItem.value}
              href={
                tabItem.value === "all"
                  ? "/admin/messages"
                  : `/admin/messages?tab=${tabItem.value}`
              }
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span>{tabItem.label}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  active
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {tabItem.count}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {visibleMessages.length === 0 && (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        )}
        {visibleMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "card-elevated rounded-2xl border p-5",
              msg.read
                ? "border-border bg-card"
                : "border-primary/30 bg-primary/[0.03]",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{msg.name}</p>
                  {!msg.read && <Pill tone="accent">New</Pill>}
                </div>
                <a
                  href={`mailto:${msg.email}`}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {msg.email}
                </a>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <form action={toggleMessageRead}>
                  <input type="hidden" name="id" value={msg.id} />
                  <input
                    type="hidden"
                    name="read"
                    value={(!msg.read).toString()}
                  />
                  <button
                    type="submit"
                    className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label={msg.read ? "Mark unread" : "Mark read"}
                    title={msg.read ? "Mark as unread" : "Mark as read"}
                  >
                    {msg.read ? (
                      <MailOpen className="size-4" />
                    ) : (
                      <Mail className="size-4" />
                    )}
                  </button>
                </form>
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={msg.id} />
                  <DeleteButton compact confirmLabel="Delete this message?" />
                </form>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
              {msg.message}
            </p>
            <p className="mt-3 text-xs text-muted-foreground/60">
              {msg.createdAt.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
