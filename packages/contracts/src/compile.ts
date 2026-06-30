import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import solc from "solc";

export type ContractAbiItem = {
  type: string;
  name?: string;
  inputs?: Array<{ name: string; type: string; indexed?: boolean }>;
  outputs?: Array<{ name: string; type: string }>;
  stateMutability?: string;
};

export type CompiledContract = {
  contractName: "PaymentEvidenceRegistry";
  abi: ContractAbiItem[];
  bytecode: `0x${string}`;
};

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contractName = "PaymentEvidenceRegistry";
const sourceName = `${contractName}.sol`;

export function compileRegistryContract(): CompiledContract {
  const source = readFileSync(resolve(packageDir, "contracts", sourceName), "utf8");
  const input = {
    language: "Solidity",
    sources: {
      [sourceName]: {
        content: source
      }
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode.object"]
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input))) as {
    errors?: Array<{ severity: "error" | "warning"; formattedMessage: string }>;
    contracts?: Record<string, Record<string, { abi: ContractAbiItem[]; evm: { bytecode: { object: string } } }>>;
  };

  const errors = output.errors?.filter((error) => error.severity === "error") ?? [];
  if (errors.length > 0) {
    throw new Error(errors.map((error) => error.formattedMessage).join("\n"));
  }

  const compiled = output.contracts?.[sourceName]?.[contractName];
  if (!compiled) {
    throw new Error(`Unable to compile ${contractName}`);
  }

  return {
    contractName,
    abi: compiled.abi,
    bytecode: `0x${compiled.evm.bytecode.object}`
  };
}
