"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { AuthPanel } from "@/components/auth-panel";
import { ContactForm } from "@/components/contact-form";
import { ContactTable } from "@/components/contact-table";
import { ContactToolbar } from "@/components/contact-toolbar";
import { Button } from "@/components/ui/button";
import { getNeonClient, hasNeonConfig } from "@/lib/neon-client";
import { parseContactInput } from "@/lib/validation";
import type { Contact, ContactInput, ContactSortKey, Priority } from "@/lib/types";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Something went wrong.";
}

async function validateOnServer(input: ContactInput) {
  const response = await fetch("/api/contacts/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as
    | { ok: true; contact: ContactInput }
    | { ok: false; errors: string[] };

  if (!response.ok || !payload.ok) {
    throw new Error(
      "errors" in payload ? payload.errors.join(" ") : "Contact validation failed.",
    );
  }

  return payload.contact;
}

export function NetworkingTracker() {
  if (!hasNeonConfig()) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
        <section className="rounded-[var(--radius)] border border-border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-foreground">Neon setup required</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Add `NEXT_PUBLIC_NEON_AUTH_URL` and `NEXT_PUBLIC_NEON_DATA_API_URL` to
            `.env.local`, run the SQL in `db/schema.sql`, and restart the dev server.
          </p>
        </section>
      </main>
    );
  }

  return <TrackerWithClient />;
}

function TrackerWithClient() {
  const neon = getNeonClient();
  const session = neon.auth.useSession();
  const user = session.data?.user;
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<"all" | Priority>("all");
  const [sortKey, setSortKey] = useState<ContactSortKey>("created_at");
  const [ascending, setAscending] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadContacts = useCallback(async () => {
    if (!user) {
      setContacts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: dataError } = await neon
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (dataError) {
        throw dataError;
      }

      setContacts((data ?? []) as Contact[]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [neon, user]);

  useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  async function saveContact(input: ContactInput) {
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const localValidation = parseContactInput(input);
      if (!localValidation.ok) {
        throw new Error(localValidation.errors.join(" "));
      }

      const validated = await validateOnServer(localValidation.data);

      if (editingContact) {
        const { error: updateError } = await neon
          .from("contacts")
          .update(validated)
          .eq("id", editingContact.id);

        if (updateError) {
          throw updateError;
        }

        setMessage("Contact updated.");
        setEditingContact(null);
      } else {
        const { error: insertError } = await neon.from("contacts").insert(validated);

        if (insertError) {
          throw insertError;
        }

        setMessage("Contact added.");
      }

      await loadContacts();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function deleteContact(contact: Contact) {
    const confirmed = window.confirm(`Delete ${contact.name}?`);
    if (!confirmed) {
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const { error: deleteError } = await neon
        .from("contacts")
        .delete()
        .eq("id", contact.id);

      if (deleteError) {
        throw deleteError;
      }

      setMessage("Contact deleted.");
      if (editingContact?.id === contact.id) {
        setEditingContact(null);
      }
      await loadContacts();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const visibleContacts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const priorityRank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

    return contacts
      .filter((contact) => {
        const matchesPriority = priority === "all" || contact.priority === priority;
        const haystack = [
          contact.name,
          contact.company,
          contact.role,
          contact.where_met,
          contact.notes,
        ]
          .join(" ")
          .toLowerCase();

        return matchesPriority && (!normalizedQuery || haystack.includes(normalizedQuery));
      })
      .sort((a, b) => {
        let comparison = 0;

        if (sortKey === "priority") {
          comparison = priorityRank[a.priority] - priorityRank[b.priority];
        } else {
          comparison = String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? ""));
        }

        return ascending ? comparison : comparison * -1;
      });
  }, [ascending, contacts, priority, query, sortKey]);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-[var(--radius)] border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800">
            <ShieldCheck aria-hidden="true" className="h-4 w-4" />
            Neon RLS protected
          </div>
          <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
            Berkeley Networking Tracker
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Track the classmates, alumni, recruiters, and coffee-chat leads you want to stay connected with.
          </p>
        </div>
        {user ? (
          <Button type="button" variant="secondary" onClick={loadContacts} disabled={loading}>
            <RefreshCw aria-hidden="true" className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            Refresh
          </Button>
        ) : null}
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(300px,380px)_1fr]">
        <div className="grid content-start gap-4">
          <AuthPanel auth={neon.auth} user={user} />
          {user ? (
            <ContactForm
              editingContact={editingContact}
              busy={saving}
              onCancelEdit={() => setEditingContact(null)}
              onSubmit={saveContact}
            />
          ) : null}
        </div>

        <div className="grid content-start gap-4">
          {session.isPending ? (
            <section className="rounded-[var(--radius)] border border-border bg-card p-8 text-center shadow-sm">
              <p className="text-sm text-muted-foreground">Checking your session...</p>
            </section>
          ) : user ? (
            <>
              <ContactToolbar
                query={query}
                priority={priority}
                sortKey={sortKey}
                ascending={ascending}
                onQueryChange={setQuery}
                onPriorityChange={setPriority}
                onSortKeyChange={setSortKey}
                onAscendingChange={setAscending}
              />
              {message ? (
                <div className="rounded-[var(--radius)] border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800">
                  {message}
                </div>
              ) : null}
              {error ? (
                <div className="rounded-[var(--radius)] border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  {error}
                </div>
              ) : null}
              {loading ? (
                <section className="rounded-[var(--radius)] border border-border bg-card p-8 text-center shadow-sm">
                  <p className="text-sm text-muted-foreground">Loading contacts...</p>
                </section>
              ) : (
                <ContactTable
                  contacts={visibleContacts}
                  onEdit={setEditingContact}
                  onDelete={deleteContact}
                />
              )}
            </>
          ) : (
            <section className="rounded-[var(--radius)] border border-border bg-card p-8 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">Sign in to view contacts</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your private list appears here after authentication succeeds.
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
