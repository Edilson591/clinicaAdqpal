import { describe, expect, it } from "vitest";
import { sanitizeGeneratedHtml } from "../../utils/sanitizeGeneratedHtml";

describe("sanitizeGeneratedHtml", () => {
  it("remove scripts, eventos e URLs executáveis", () => {
    const result = sanitizeGeneratedHtml('<html><body onload="steal()"><script>steal()</script><a href="javascript:steal()">x</a><p>seguro</p></body></html>');
    expect(result).not.toContain("<script");
    expect(result).not.toContain("onload");
    expect(result).not.toContain("javascript:");
    expect(result).toContain("seguro");
  });
});
