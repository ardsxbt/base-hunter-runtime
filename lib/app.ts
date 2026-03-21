import { agentPositionService } from './services/agent/position.service';
import { agentRuntimeService } from './services/agent/agentRuntime.service';

export class App {
  async start(): Promise<void> {
    console.log('🚀 Base Hunter Runtime Starting...');

    await agentRuntimeService.start();

    // Position risk manager loop (TP/SL/time-based close checks)
    setInterval(async () => {
      try {
        await agentPositionService.evaluateRiskAndClose();
      } catch (error) {
        console.error('Agent position manager loop error:', error);
      }
    }, 60_000);
  }
}
