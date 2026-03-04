import { describe, it, expect, vi } from "vitest";
import { isCommandHighRisk } from "../src/core/safety.js";
import config from "../src/core/config.js";

// Mock the config module because we don't want to change real user preferences during a test
vi.mock("../src/core/config.js", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("Safety Logic", () => {
  it("should return high risk if score is 8 or above and safety is enabled", () => {
    config.get.mockReturnValue(true); // Mock safetyMode = true
    expect(isCommandHighRisk(9)).toBe(true);
  });

  it("should NOT return high risk if score is below 8", () => {
    config.get.mockReturnValue(true); // Mock safetyMode = true
    expect(isCommandHighRisk(6)).toBe(false);
  });

  it("should NOT return high risk if safety mode is disabled manually", () => {
    config.get.mockReturnValue(false); // Mock safetyMode = false
    expect(isCommandHighRisk(10)).toBe(false);
  });
});
