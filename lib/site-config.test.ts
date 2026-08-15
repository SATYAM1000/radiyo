import { describe, expect, it } from "vitest";
import { defaultConfig, migrateConfig } from "./site-config";

describe("migrateConfig", () => {
  it("parses defaultConfig", () => {
    expect(() => migrateConfig(defaultConfig("Test"))).not.toThrow();
  });

  it("fills defaults for configs saved before newer widgets existed", () => {
    const old = defaultConfig("Old") as Record<string, unknown>;
    const widgets = { ...(old.widgets as Record<string, unknown>) };
    delete widgets.ambient;
    delete widgets.reactions;
    delete widgets.tipJar;
    delete widgets.dayNight;
    const parsed = migrateConfig({ ...old, widgets });
    expect(parsed.widgets.ambient.enabled).toBe(false);
    expect(parsed.widgets.reactions.enabled).toBe(false);
  });

  // Regression: the editor stores "" for cleared inputs; a saved config with
  // empty social URLs must never fail to parse (it 404'd the editor once).
  it("accepts empty strings in optional social fields", () => {
    const config = defaultConfig("Test");
    config.widgets.social = {
      enabled: true,
      whatsapp: "",
      instagram: "",
      youtube: "",
      twitter: "https://x.com/satyamx55",
      linkedin: "",
      email: "satyam@example.com",
    };
    expect(() => migrateConfig(config)).not.toThrow();
  });

  it("still rejects malformed URLs in social fields", () => {
    const config = defaultConfig("Test");
    config.widgets.social.instagram = "not a url";
    expect(() => migrateConfig(config)).toThrow();
  });
});
