export interface Message {
  id: string;
  role: 'human' | 'ai';
  content: string;
  isTemporary?: boolean;
  timestamp?: string; // Date string ex: 2 mins ago
  createdAt?: string;
}

export interface ChatData {
  question: string;
  fileUrl?: string;
}

export interface Conversation {
  id: string;
  // customer: {
  //   name: string;
  //   email: string;
  //   status: 'online' | 'offline';
  //   lastSeen?: string;
  // };
  user: {
    id: string;
    name: string;
    email: string;
    // status: 'online' | 'offline';
    // lastSeen?: string;
  };
  messages?: Message[];
  status: 'active' | 'resolved' | 'pending';
  category: string;
  priority: 'low' | 'medium' | 'high';
  created_at?: string;
  updated_at?: string;
}
