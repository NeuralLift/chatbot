export interface Message {
  id: string;
  role: string;
  content: string;
}

export interface ChatData {
  question: string;
  fileUrl?: string;
}
