import type { GateConfig } from "../types.js";
export interface GateResult {
    passed: boolean;
    reason?: string;
}
/**
 * Run auto gate checks on step output.
 */
export declare function runAutoGate(output: string, config: GateConfig): GateResult;
//# sourceMappingURL=gate.d.ts.map