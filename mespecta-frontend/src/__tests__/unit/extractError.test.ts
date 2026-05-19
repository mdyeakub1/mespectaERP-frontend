import { describe, it, expect } from "vitest";
import { extractError } from "../../utils/extractError";

describe("extractError", () => {
  it("returns the fallback when error is undefined", () => {
    expect(extractError(undefined)).toBe("Something went wrong");
  });

  it("uses a custom fallback when provided", () => {
    expect(extractError(undefined, "Custom error")).toBe("Custom error");
  });

  it("extracts PascalCase Message from axios response", () => {
    const error = { response: { data: { Message: "Not found" } } };
    expect(extractError(error)).toBe("Not found");
  });

  it("extracts camelCase message from axios response", () => {
    const error = { response: { data: { message: "Unauthorized" } } };
    expect(extractError(error)).toBe("Unauthorized");
  });

  it("prefers PascalCase Message over camelCase message", () => {
    const error = { response: { data: { Message: "PascalWins", message: "camelLoses" } } };
    expect(extractError(error)).toBe("PascalWins");
  });

  it("falls back to error.message when no response data message", () => {
    const error = { message: "Network Error" };
    expect(extractError(error)).toBe("Network Error");
  });

  it("falls back to the fallback string when all else is missing", () => {
    const error = { response: { data: {} } };
    expect(extractError(error, "Fallback")).toBe("Fallback");
  });
});
