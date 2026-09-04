"use client";

import { FormEvent, useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { priorities, type Contact, type ContactInput } from "@/lib/types";

const emptyInput: ContactInput = {
  name: "",
  company: "",
  role: "",
  where_met: "",
  notes: "",
  priority: "medium",
};

type ContactFormProps = {
  editingContact: Contact | null;
  busy?: boolean;
  onCancelEdit: () => void;
  onSubmit: (input: ContactInput) => Promise<void>;
};

export function ContactForm({
  editingContact,
  busy = false,
  onCancelEdit,
  onSubmit,
}: ContactFormProps) {
  const [input, setInput] = useState<ContactInput>(emptyInput);

  useEffect(() => {
    if (editingContact) {
      setInput({
        name: editingContact.name,
        company: editingContact.company,
        role: editingContact.role,
        where_met: editingContact.where_met,
        notes: editingContact.notes,
        priority: editingContact.priority,
      });
    } else {
      setInput(emptyInput);
    }
  }, [editingContact]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(input);
    if (!editingContact) {
      setInput(emptyInput);
    }
  }

  return (
    <section className="rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {editingContact ? "Edit Contact" : "Add Contact"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Capture the people you want to keep warm after class, events, and coffee chats.
          </p>
        </div>
        {editingContact ? (
          <Button type="button" variant="ghost" size="icon" onClick={onCancelEdit} aria-label="Cancel edit">
            <X aria-hidden="true" className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      <form className="grid gap-4" onSubmit={submit}>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={input.name}
            onChange={(event) => setInput({ ...input, name: event.target.value })}
            placeholder="Alex Morgan"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={input.company}
              onChange={(event) => setInput({ ...input, company: event.target.value })}
              placeholder="Berkeley Haas"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={input.role}
              onChange={(event) => setInput({ ...input, role: event.target.value })}
              placeholder="MBA candidate"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="where-met">Where met</Label>
            <Input
              id="where-met"
              value={input.where_met}
              onChange={(event) => setInput({ ...input, where_met: event.target.value })}
              placeholder="Orientation mixer"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              id="priority"
              value={input.priority}
              onChange={(event) =>
                setInput({
                  ...input,
                  priority: event.target.value as ContactInput["priority"],
                })
              }
            >
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={input.notes}
            onChange={(event) => setInput({ ...input, notes: event.target.value })}
            placeholder="Follow up about clean energy internships next week."
          />
        </div>

        <Button type="submit" disabled={busy}>
          <Save aria-hidden="true" className="h-4 w-4" />
          {busy ? "Saving..." : editingContact ? "Save changes" : "Add contact"}
        </Button>
      </form>
    </section>
  );
}
