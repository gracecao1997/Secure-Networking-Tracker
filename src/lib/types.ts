export const priorities = ["high", "medium", "low"] as const;

export type Priority = (typeof priorities)[number];

export type Contact = {
  id: string;
  user_id: string;
  name: string;
  company: string;
  role: string;
  where_met: string;
  notes: string;
  priority: Priority;
  created_at: string;
  updated_at: string;
};

export type ContactInput = {
  name: string;
  company: string;
  role: string;
  where_met: string;
  notes: string;
  priority: Priority;
};

export type ContactSortKey = "name" | "company" | "role" | "priority" | "created_at";

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: Contact;
        Insert: ContactInput;
        Update: Partial<ContactInput>;
      };
    };
  };
};
