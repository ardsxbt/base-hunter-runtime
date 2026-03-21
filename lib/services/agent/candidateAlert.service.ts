import fs from 'fs';
import path from 'path';

export interface ICandidateAlert {
  timestamp: string;
  token: string;
  tokenAddress: string;
  pairAddress: string;
  score: number;
  reasons: string[];
}

class CandidateAlertService {
  private readonly file = path.resolve(process.cwd(), 'pending-candidate-alerts.json');

  push(alert: ICandidateAlert): void {
    const data = this.readAll();
    data.push(alert);
    fs.writeFileSync(this.file, JSON.stringify(data, null, 2), 'utf8');
  }

  readAll(): ICandidateAlert[] {
    try {
      if (!fs.existsSync(this.file)) return [];
      return JSON.parse(fs.readFileSync(this.file, 'utf8')) as ICandidateAlert[];
    } catch {
      return [];
    }
  }
}

export const candidateAlertService = new CandidateAlertService();
