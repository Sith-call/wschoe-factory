import type { GateConfig } from "../types.js";

export interface GateResult {
  passed: boolean;
  reason?: string;
}

/**
 * Run auto gate checks on step output.
 */
export function runAutoGate(output: string, config: GateConfig): GateResult {
  const checks = config.autoChecks;
  if (!checks) return { passed: true };

  if (checks.minLength !== undefined && output.length < checks.minLength) {
    return { passed: false, reason: `Output too short (${output.length} < ${checks.minLength})` };
  }

  if (checks.maxLength !== undefined && output.length > checks.maxLength) {
    return { passed: false, reason: `Output too long (${output.length} > ${checks.maxLength})` };
  }

  if (checks.mustContain) {
    for (const kw of checks.mustContain) {
      if (!output.includes(kw)) {
        return { passed: false, reason: `Missing required keyword: "${kw}"` };
      }
    }
  }

  if (checks.mustNotContain) {
    for (const kw of checks.mustNotContain) {
      if (output.includes(kw)) {
        return { passed: false, reason: `Contains forbidden keyword: "${kw}"` };
      }
    }
  }

  if (checks.regex) {
    const re = new RegExp(checks.regex);
    if (!re.test(output)) {
      return { passed: false, reason: `Output does not match regex: ${checks.regex}` };
    }
  }

  return { passed: true };
}
