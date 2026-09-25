import Link from "next/link";
import { ArrowLeft, Mail, MailOpen, Reply } from "lucide-react";
import { getMessages } from "@/db/queries";
import type { Message } from "@/db/schema";
import { toggleMessageRead, deleteMessage } from "../actions";
import { DeleteButton } from "../_components/delete-button";
import { PageHeader, Pill } from "../_components/ui";
import { cn } from "@/lib/utils";

type MessageFilter = "all" | "unread" | "read";

function normalizeFilter(value?: string): MessageFilter {
  return value === "unread" || value === "read" ? value : "all";
}

/** Link back into this page, keeping the active filter and picking a message. */
function messagesHref(tab: MessageFilter, id?: number): string {
  const params = new URLSearchParams();
  if (tab !== "all") params.set("tab", tab);
  if (id !== undefined) params.set("id", String(id));
  const query = params.toString();
  return query ? `/admin/messages?${query}` : "/admin/messages";
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

const shortDateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});

/**
 * Mail-client shorthand: time for today, day and month for this year, and a
 * full date once it is older. Keeps the list column narrow and scannable.
 */
function listTimestamp(date: Date, now: Date): string {
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) return timeFormat.format(date);
  if (date.getFullYear() === now.getFullYear()) {
    return shortDateFormat.format(date);
  }
  return String(date.getFullYear());
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]![0]!;
  const last = parts.length > 1 ? parts[parts.length - 1]![0]! : "";
  return (first + last).toUpperCase();
}

/** A one-line preview of the body, with newlines collapsed to spaces. */
function preview(message: string): string {
  return message.replace(/\s+/g, " ").trim();
}

function Avatar({ name, muted }: { name: string; muted?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full text-xs font-medium",
        muted
          ? "bg-surface-sunken text-muted-foreground"
          : "bg-accent text-accent-foreground",
      )}
    >
      {initials(name)}
    </span>
  );
}

function MessageRow({
  msg,
  tab,
  selected,
  now,
}: {
  msg: Message;
  tab: MessageFilter;
  selected: boolean;
  now: Date;
}) {
  return (
    <Link
      href={messagesHref(tab, msg.id)}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "flex gap-3 rounded-xl p-3 transition-colors duration-200 ease-standard",
        selected
          ? "bg-accent text-accent-foreground"
          : "hover:bg-surface-sunken",
      )}
    >
      <Avatar name={msg.name} muted={msg.read || selected} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p
            className={cn(
              "truncate text-sm",
              msg.read ? "text-foreground" : "font-semibold text-foreground",
              selected && "text-accent-foreground",
            )}
          >
            {msg.name}
          </p>
          <span
            className={cn(
              "shrink-0 text-xs tabular-nums",
              selected ? "text-accent-foreground/70" : "text-muted-foreground",
            )}
          >
            {listTimestamp(msg.createdAt, now)}
          </span>
        </div>
        <p
          className={cn(
            "truncate text-xs",
            selected ? "text-accent-foreground/80" : "text-muted-foreground",
          )}
        >
          {msg.email}
        </p>
        <p
          className={cn(
            "mt-1 line-clamp-2 text-xs leading-5",
            selected
              ? "text-accent-foreground/80"
              : "text-subtle-foreground",
          )}
        >
          {preview(msg.message)}
        </p>
      </div>
      {!msg.read && (
        <span
          aria-label="Unread"
          className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
        />
      )}
    </Link>
  );
}

/** Site hostname, used only to name the site in the reply subject line. */
function siteName(): string {
  try {
    return new URL(process.env.NEXT_PUBLIC_APP_URL ?? "").hostname;
  } catch {
    return "the site";
  }
}

function MessageDetail({ msg, tab }: { msg: Message; tab: MessageFilter }) {
  const replyHref = `mailto:${msg.email}?subject=${encodeURIComponent(
    `Re: your message to ${siteName()}`,
  )}`;

  return (
    <article className="flex h-full flex-col">
      {/* Mobile-only way back to the list; the two panes sit side by side on
          large screens, so the control would be redundant there. */}
      <Link
        href={messagesHref(tab)}
        className="state-layer mb-4 -ml-2 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground lg:hidden"
      >
        <ArrowLeft className="size-4" />
        All messages
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-outline-variant pb-5">
        <div className="flex min-w-0 gap-3">
          <Avatar name={msg.name} muted={msg.read} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg leading-6 text-foreground">{msg.name}</h2>
              {!msg.read && <Pill tone="accent">New</Pill>}
            </div>
            <a
              href={`mailto:${msg.email}`}
              className="text-sm break-all text-muted-foreground hover:text-foreground"
            >
              {msg.email}
            </a>
            <p className="mt-1 text-xs text-muted-foreground/70">
              {dateFormat.format(msg.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <a
            href={replyHref}
            className="state-layer inline-flex h-9 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-foreground"
          >
            <Reply className="size-4" />
            Reply
          </a>
          <form action={toggleMessageRead}>
            <input type="hidden" name="id" value={msg.id} />
            <input
              type="hidden"
              name="read"
              value={(!msg.read).toString()}
            />
            <button
              type="submit"
              className="state-layer rounded-full p-2 text-muted-foreground hover:text-foreground"
              aria-label={msg.read ? "Mark as unread" : "Mark as read"}
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
      </header>

      {/* Reading measure capped at ~70 characters; `pre-wrap` keeps the
          sender's own line breaks and indentation intact. */}
      <div className="max-w-[70ch] flex-1 py-6 text-[0.9375rem] leading-7 whitespace-pre-wrap break-words text-foreground">
        {msg.message}
      </div>
    </article>
  );
}

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; id?: string }>;
}) {
  const [{ tab, id }, messages] = await Promise.all([
    searchParams,
    getMessages(),
  ]);
  const activeTab = normalizeFilter(tab);
  const now = new Date();

  const unreadCount = messages.filter((msg) => !msg.read).length;
  const readCount = messages.length - unreadCount;

  const visibleMessages = messages.filter((msg) => {
    if (activeTab === "unread") return !msg.read;
    if (activeTab === "read") return msg.read;
    return true;
  });

  const selectedId = id ? Number(id) : undefined;
  const selected =
    selectedId !== undefined
      ? visibleMessages.find((msg) => msg.id === selectedId)
      : undefined;
  // A message deleted or filtered out leaves a stale `?id=` in the URL.
  const staleSelection = selectedId !== undefined && !selected;

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

      {/* Filter chips: 32px pill, hairline at rest, tonal fill when selected. */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tabItem) => {
          const active = activeTab === tabItem.value;
          return (
            <Link
              key={tabItem.value}
              href={messagesHref(tabItem.value)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "chip-hit inline-flex h-8 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors duration-200 ease-standard",
                active
                  ? "bg-accent text-accent-foreground"
                  : "border border-border text-muted-foreground hover:bg-surface-sunken hover:text-foreground",
              )}
            >
              <span>{tabItem.label}</span>
              <span className="tabular-nums opacity-70">{tabItem.count}</span>
            </Link>
          );
        })}
      </div>

      {visibleMessages.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {activeTab === "all"
            ? "No messages yet."
            : `No ${activeTab} messages.`}
        </p>
      ) : (
        /* Master–detail: on large screens the list and the reading pane sit
           side by side. Below that it is a drill-down — picking a message
           swaps the list out for the message itself. */
        <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start">
          <nav
            aria-label="Messages"
            className={cn(
              "flex flex-col gap-1 lg:sticky lg:top-6 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto lg:pr-1",
              selected && "hidden lg:flex",
            )}
          >
            {visibleMessages.map((msg) => (
              <MessageRow
                key={msg.id}
                msg={msg}
                tab={activeTab}
                selected={msg.id === selectedId}
                now={now}
              />
            ))}
          </nav>

          <div
            className={cn(
              "rounded-2xl border border-outline-variant surface-container p-6 lg:min-h-[28rem]",
              !selected && !staleSelection && "hidden lg:block",
              staleSelection && "lg:block",
            )}
          >
            {selected ? (
              <MessageDetail msg={selected} tab={activeTab} />
            ) : (
              <div className="grid h-full min-h-[16rem] place-items-center text-center">
                <div>
                  <MailOpen
                    className="mx-auto size-8 text-muted-foreground/50"
                    aria-hidden
                  />
                  <p className="mt-3 text-sm text-muted-foreground">
                    {staleSelection
                      ? "That message is no longer here."
                      : "Select a message to read it."}
                  </p>
                  {staleSelection && (
                    <Link
                      href={messagesHref(activeTab)}
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      Back to all messages
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
