import { describe, expect, it } from "vitest";
import { compileRegistryContract } from "../src/compile";

describe("PaymentEvidenceRegistry contract", () => {
  it("compiles to deployable ABI and bytecode with a recordEvidence entrypoint", () => {
    const compiled = compileRegistryContract();

    expect(compiled.contractName).toBe("PaymentEvidenceRegistry");
    expect(compiled.bytecode).toMatch(/^0x[0-9a-f]+$/i);
    expect(compiled.bytecode.length).toBeGreaterThan(200);
    expect(compiled.abi.some((item) => item.type === "function" && item.name === "recordEvidence")).toBe(true);
    expect(compiled.abi.some((item) => item.type === "event" && item.name === "EvidenceRecorded")).toBe(true);
  });
});
