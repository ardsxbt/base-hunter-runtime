import fs from 'fs';
import path from 'path';

export interface ISwapNotifyEvent {
  timestamp: string;
  token: string;
  tokenAddress: string;
  amountEth: number;
  txHash?: string;
  mode: 'paper' | 'live';
  status: 'simulated' | 'submitted' | 'failed';
  reason: string;
}

class SwapNotifyService {
  private readonly file = path.resolve(process.cwd(), 'pending-swap-notify.json');

  push(event: ISwapNotifyEvent): void {
    const data = this.readAll();
    data.push(event);
    fs.writeFileSync(this.file, JSON.stringify(data, null, 2), 'utf8');
  }

  readAll(): ISwapNotifyEvent[] {
    try {
      if (!fs.existsSync(this.file)) return [];
      return JSON.parse(fs.readFileSync(this.file, 'utf8')) as ISwapNotifyEvent[];
    } catch {
      return [];
    }
  }
}

export const swapNotifyService = new SwapNotifyService();
