import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appDir = resolve(__dirname, "../src/app");

describe("layout regressions", () => {
  it("does not inject raw stylesheet links inside the html element", () => {
    const layoutSource = readFileSync(resolve(appDir, "layout.tsx"), "utf8");

    expect(layoutSource).not.toContain('rel="stylesheet"');
    expect(layoutSource).not.toContain("fonts.googleapis.com");
  });

  it("stacks the hero console before medium desktop widths can overlap the headline", () => {
    const css = readFileSync(resolve(appDir, "globals.css"), "utf8");

    expect(css).toContain("@media (max-width: 1380px)");
    expect(css).toContain(".hero-command");
    expect(css).toContain("grid-template-columns: 1fr");
  });
});
