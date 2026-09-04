"use client";

import { ArrowDownAZ, ArrowUpAZ, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import type { ContactSortKey, Priority } from "@/lib/types";

type ContactToolbarProps = {
  query: string;
  priority: "all" | Priority;
  sortKey: ContactSortKey;
  ascending: boolean;
  onQueryChange: (query: string) => void;
  onPriorityChange: (priority: "all" | Priority) => void;
  onSortKeyChange: (sortKey: ContactSortKey) => void;
  onAscendingChange: (ascending: boolean) => void;
};

export function ContactToolbar({
  query,
  priority,
  sortKey,
  ascending,
  onQueryChange,
  onPriorityChange,
  onSortKeyChange,
  onAscendingChange,
}: ContactToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius)] border border-border bg-card p-3 shadow-sm lg:flex-row lg:items-center">
      <label className="relative flex-1">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <span className="sr-only">Filter contacts by text</span>
        <Input
          className="pl-9"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search name, company, role, notes"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,140px)_minmax(0,160px)_auto]">
        <Select
          aria-label="Filter by priority"
          value={priority}
          onChange={(event) => onPriorityChange(event.target.value as "all" | Priority)}
        >
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>

        <Select
          aria-label="Sort contacts"
          value={sortKey}
          onChange={(event) => onSortKeyChange(event.target.value as ContactSortKey)}
        >
          <option value="created_at">Newest</option>
          <option value="name">Name</option>
          <option value="company">Company</option>
          <option value="role">Role</option>
          <option value="priority">Priority</option>
        </Select>

        <Button
          type="button"
          variant="secondary"
          onClick={() => onAscendingChange(!ascending)}
          aria-label={ascending ? "Sort descending" : "Sort ascending"}
        >
          {ascending ? (
            <ArrowUpAZ aria-hidden="true" className="h-4 w-4" />
          ) : (
            <ArrowDownAZ aria-hidden="true" className="h-4 w-4" />
          )}
          {ascending ? "Asc" : "Desc"}
        </Button>
      </div>
    </div>
  );
}
