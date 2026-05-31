import type {
  NotificationType,
  NotificationChannel,
  NotificationStatus,
  AdminLogAction,
} from '../enums';

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  channel: NotificationChannel;
  status: NotificationStatus;
  readAt: Date | null;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  type: NotificationType;
  email: boolean;
  push: boolean;
  inApp: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  channel: NotificationChannel;
  subject: string;
  template: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Admin Types
export interface AdminLog {
  id: string;
  adminId: string;
  action: AdminLogAction;
  targetType: string;
  targetId: string;
  previousData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

export interface FeatureFlag {
  id: string;
  key: string;
  description: string | null;
  isEnabled: boolean;
  rolloutPercentage: number;
  targetUsers: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}
