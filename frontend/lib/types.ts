export type BotEvent = {
  type: 'bot_spawn' | 'bot_move' | 'bot_click' | 'bot_log' | 'bot_complete' | 'run_started' | 'report_ready';
  botId?: string;
  page?: string;
  x?: number;
  y?: number;
  z?: number;
  message?: string;
  timestamp?: number;
  loadTime?: number;
  error?: boolean;
};

export type DashboardMetrics = {
  loadTime: number;
  errorRate: number;
  dropOff: number;
  signupSuccess: number;
  pagePerformance: number;
};
