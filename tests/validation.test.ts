import { describe, expect, it } from "vitest";
import { parseContactInput } from "@/lib/validation";

describe("contact validation", () => {
  it("rejects an empty name", () => {
    const result = parseContactInput({
      name: "   ",
      company: "Berkeley Haas",
      role: "MBA",
      where_met: "Orientation",
      notes: "",
      priority: "medium",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain("Name is required.");
    }
  });

  it("rejects an invalid priority", () => {
    const result = parseContactInput({
      name: "Alex",
      company: "",
      role: "",
      where_met: "",
      notes: "",
      priority: "urgent",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain("Priority must be high, medium, or low.");
    }
  });

  it("accepts and normalizes valid contact input", () => {
    const result = parseContactInput({
      name: "  Alex  ",
      company: "  Climate Co  ",
      role: "  Founder  ",
      where_met: "  Coffee chat  ",
      notes: "  Follow up Friday  ",
      priority: "high",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({
        name: "Alex",
        company: "Climate Co",
        role: "Founder",
        where_met: "Coffee chat",
        notes: "Follow up Friday",
        priority: "high",
      });
    }
  });
});
