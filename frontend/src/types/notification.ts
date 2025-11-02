type NotificationType =
  | "friend_request"
  | "friend_accept"
  | "message"
  | "system";

export type Notification = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  read?: boolean;
  type?: NotificationType;
  avatarUrl?: string;
};
