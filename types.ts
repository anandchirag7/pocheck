
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    sql?: string;
    data?: any[];
    isFaq?: boolean;
  };
}

export enum QueryType {
  PO_HEADER = 'PO_HEADER',
  SUPPLIER = 'SUPPLIER',
  REQUISITION = 'REQUISITION',
  INVOICE = 'INVOICE',
  PAYMENT = 'PAYMENT',
  COST_CENTER = 'COST_CENTER',
  GENERAL = 'GENERAL'
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
