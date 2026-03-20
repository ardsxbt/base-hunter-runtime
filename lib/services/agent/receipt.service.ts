import fs from 'fs';
import path from 'path';
import { IAgentReceipt } from '../../interface/agent.interface';

class AgentReceiptService {
  private readonly receiptPath = path.resolve(process.cwd(), 'agent_log.json');

  append(receipt: IAgentReceipt): void {
    const existing = this.readAll();
    existing.push(receipt);
    fs.writeFileSync(this.receiptPath, JSON.stringify(existing, null, 2), 'utf8');
  }

  readAll(): IAgentReceipt[] {
    try {
      if (!fs.existsSync(this.receiptPath)) return [];
      return JSON.parse(fs.readFileSync(this.receiptPath, 'utf8')) as IAgentReceipt[];
    } catch {
      return [];
    }
  }
}

export const agentReceiptService = new AgentReceiptService();
