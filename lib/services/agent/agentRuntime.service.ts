import { tokenMonitoringService } from '../monitoring/tokenMonitoring.service';
import { decisionEngineService } from './decisionEngine.service';
import { getNonWETHToken } from '../../contracts/pairAnalyzer';

class AgentRuntimeService {
  async start(): Promise<void> {
    tokenMonitoringService.setPairAlertHandler(async (pairInfo, exchange) => {
      const token = getNonWETHToken(pairInfo);
      console.log(
        `🎯 Candidate detected ${token.symbol} on ${exchange} | liq=${pairInfo.liquidityETH.toFixed(2)} ETH`
      );
      await decisionEngineService.evaluateAndAct({ pairInfo, exchange });
    });

    await tokenMonitoringService.start();
    console.log('🤖 Agent runtime started (service mode, no Telegram)');
  }

  stop(): void {
    tokenMonitoringService.stop();
    console.log('🤖 Agent runtime stopped');
  }
}

export const agentRuntimeService = new AgentRuntimeService();
