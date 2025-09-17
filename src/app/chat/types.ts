export interface Sender {
  id: number;
  email: string;
  first_name: string;
  profile: { profile_image: string };
}

export interface Message {
  highlight: boolean;
  id: number;
  sender: Sender;
  content?: string;
  images?: { id: number; image: string }[];
  voice?: string;
  time: string;
  isCurrentUser: boolean;
  is_read: boolean;
  reactions?: { id: number; user: Sender; reaction: string }[];
  reply_to?: { id: number; sender: Sender; content: string } | null | number;
  updated_at?: string;
  created_at: string;
  is_edited?: boolean;
}

export interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: string;
}

export interface Chat {
  id: number;
  contact: Contact;
  messages: Message[];
  unreadCount: number;
}