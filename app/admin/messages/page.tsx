import Link from "next/link";
import { Mail, MailOpen } from "lucide-react";
import { getMessages } from "@/db/queries";
import { toggleMessageRead, deleteMessage } from "../actions";
import { DeleteButton } from "../_components/delete-button";
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
      <h1 className="text-2xl font-light text-foreground">Messages</h1>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        Submissions from the contact form.
      </p>

      <div className="mb-6 flex flex-wrap gap-2 rounded-xl border border-border bg-muted/20 p-1">
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
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span>{tabItem.label}</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {tabItem.count}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="space-y-3">
        {visibleMessages.length === 0 && (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        )}
        {visibleMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "rounded-lg border p-4",
              msg.read ? "border-border" : "border-primary/40 bg-primary/5",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-foreground">{msg.name}</p>
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
