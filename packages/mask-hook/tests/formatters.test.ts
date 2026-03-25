import { describe, it, expect } from "vitest";
import {
  convertToFormatted,
  fillNumberOnFormat,
  getValueFromInput,
  isOnlyNumber,
} from "../src/formatters";
describe("formatters", () => {
  describe("isOnlyNumber", () => {
    it("returns true for digit-only strings", () => {
      expect(isOnlyNumber("123456789")).toBe(true);
      expect(isOnlyNumber("0")).toBe(true);
    });
    it("returns false for non-digit strings", () => {
      expect(isOnlyNumber("123-45-6789")).toBe(false);
      expect(isOnlyNumber("abc")).toBe(false);
      expect(isOnlyNumber("")).toBe(false);
    });
  });

  describe("convertToFormatted", () => {
    it("formats SSN correctly", () => {
      expect(convertToFormatted("123456789", "999–99–9999")).toBe(
        "123–45–6789",
      );
    });
    it("formats EIN correctly", () => {
      expect(convertToFormatted("123456789", "99–9999999")).toBe("12–3456789");
    });
    it("formats partial input", () => {
      expect(convertToFormatted("123", "999–99–9999")).toBe("123");
      expect(convertToFormatted("12345", "999–99–9999")).toBe("123–45");
    });
    it("handles empty input", () => {
      expect(convertToFormatted("", "999–99–9999")).toBe("");
    });
    it("handles bullet format for masking", () => {
      expect(convertToFormatted("123456789", "•••–••–9999")).toBe(
        "•••–••–6789",
      );
    });
  });

  describe("fillNumberOnFormat", () => {
    it("fills last digits on format", () => {
      expect(fillNumberOnFormat("XXX–XX–XX99", "1234")).toBe("XXX–XX–XX34");
    });
    it("fills with slice from the end", () => {
      expect(fillNumberOnFormat("XXX–XX–XX99", "123456")).toBe("XXX–XX–XX56");
    });
    it("handles single digit", () => {
      expect(fillNumberOnFormat("XXX–XX–XX99", "1")).toBe("XXX–XX–XX1");
    });
    it("returns empty for empty input", () => {
      expect(fillNumberOnFormat("XXX–XX–XX99", "")).toBe("");
    });
    it("strips non-digits from numberValue", () => {
      expect(fillNumberOnFormat("99–9999999", "12-34-56789")).toBe(
        "12–3456789",
      );
    });
  });

  describe("getValueFromInput", () => {
    it("extracts numbers from formatted input", () => {
      expect(getValueFromInput("123–45–6789", "", 9)).toBe("123456789");
    });
    it("preserves previous value for non-numeric input", () => {
      expect(getValueFromInput("12–X–6789", "123456789", 9)).toBe("1236789");
    });
    it("handles deletion (shorter length)", () => {
      expect(getValueFromInput("123–45–67", "123456789", 9)).toBe("1234567");
    });
    it("respects max length", () => {
      expect(getValueFromInput("123456789", "12345", 6)).toBe("123456");
    });
    it("handles masked input with asterisks", () => {
      expect(getValueFromInput("***–**–6789", "123456789", 9)).toBe(
        "123456789",
      );
    });
  });
});
