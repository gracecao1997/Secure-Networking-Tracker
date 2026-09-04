"use client";

import { Edit3, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Contact } from "@/lib/types";

type ContactTableProps = {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
};

export function ContactTable({ contacts, onEdit, onDelete }: ContactTableProps) {
  if (contacts.length === 0) {
    return (
      <section className="rounded-[var(--radius)] border border-dashed border-border bg-card p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">No contacts found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a contact or adjust your filters to bring people back into view.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[var(--radius)] border border-border bg-card shadow-sm">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Where met</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">{contact.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{contact.company || "-"}</td>
                <td className="px-4 py-3 text-muted-foreground">{contact.role || "-"}</td>
                <td className="px-4 py-3 text-muted-foreground">{contact.where_met || "-"}</td>
                <td className="px-4 py-3">
                  <Badge priority={contact.priority}>{contact.priority}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(contact)}
                    >
                      <Edit3 aria-hidden="true" className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(contact)}
                    >
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-0 md:hidden">
        {contacts.map((contact) => (
          <article key={contact.id} className="border-t border-border p-4 first:border-t-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-foreground">{contact.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {[contact.role, contact.company].filter(Boolean).join(" at ") || "No role listed"}
                </p>
              </div>
              <Badge priority={contact.priority}>{contact.priority}</Badge>
            </div>
            <dl className="mt-3 grid gap-2 text-sm">
              <div>
                <dt className="font-medium text-foreground">Where met</dt>
                <dd className="text-muted-foreground">{contact.where_met || "-"}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Notes</dt>
                <dd className="text-muted-foreground">{contact.notes || "-"}</dd>
              </div>
            </dl>
            <div className="mt-4 flex gap-2">
              <Button type="button" variant="secondary" onClick={() => onEdit(contact)}>
                <Edit3 aria-hidden="true" className="h-4 w-4" />
                Edit
              </Button>
              <Button type="button" variant="danger" onClick={() => onDelete(contact)}>
                <Trash2 aria-hidden="true" className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
