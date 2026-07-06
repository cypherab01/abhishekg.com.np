import { Mail, MailOpen } from "lucide-react";
import { getMessages } from "@/db/queries";
import { toggleMessageRead, deleteMessage } from "../actions";
import { DeleteButton } from "../_components/delete-button";
import { cn } from "@/lib/utils";

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div>
      <h1 className="text-2xl font-light text-foreground">Messages</h1>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        Submissions from the contact form.
      </p>

      <div className="space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        )}
        {messages.map((msg) => (
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
