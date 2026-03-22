import { IAgentContext } from '../../interface/agent.interface';

export interface IHookGuardResult {
  pass: boolean;
  reason: string;
}

/**
 * Hook-aware risk gating (v4-oriented strategy layer).
 *
 * This service does not deploy custom hooks onchain; instead it applies
 * deterministic pre/post-style guardrails that emulate hook-based policy checks
 * before allowing execution.
 */
class HookGuardService {
  preSwapCheck(ctx: IAgentContext): IHookGuardResult {
    const liq = ctx.pairInfo.liquidityETH;

    // pre-swap style guard: reject very thin/very thick pools
    if (liq < 0.5) {
      return { pass: false, reason: 'hook-pre: liquidity too thin (<0.5 ETH)' };
    }
    if (liq > 40) {
      return {
        pass: false,
        reason: 'hook-pre: liquidity too large (>40 ETH) for microcap strategy',
      };
    }

    return { pass: true, reason: 'hook-pre: passed' };
  }

  postSwapCheck(tokenAddress: string): IHookGuardResult {
    // placeholder for post-execution checks (e.g., slippage envelope sanity,
    // immediate price dislocation checks, etc.)
    if (!tokenAddress || !tokenAddress.startsWith('0x')) {
      return { pass: false, reason: 'hook-post: invalid token address' };
    }
    return { pass: true, reason: 'hook-post: passed' };
  }
}

export const hookGuardService = new HookGuardService();
