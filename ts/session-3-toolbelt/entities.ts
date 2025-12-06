// Complex Entity Definitions for Session 3
//
// These represent a realistic enterprise application with complex nested structures

export interface User {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  // Basic user info
  firstName: string;
  lastName: string;
  email: string;
  username: string;

  // Personal details
  dateOfBirth?: Date;
  phoneNumber?: string;
  avatar?: string;

  // Status and permissions
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt?: Date;

  // Complex nested objects
  profile: UserProfile;
  settings: UserSettings;
  subscription: SubscriptionInfo;

  // Arrays and relationships
  roles: Role[];
  addresses: Address[];
  paymentMethods: PaymentMethod[];

  // Metadata
  metadata: Record<string, unknown>;
  tags: string[];
}

export interface UserProfile {
  bio?: string;
  website?: string;
  location?: string;
  timezone: string;
  language: string;

  // Social links
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };

  // Professional info
  company?: string;
  jobTitle?: string;
  experience: ExperienceLevel;
  skills: string[];

  // Privacy settings
  privacy: {
    showEmail: boolean;
    showPhone: boolean;
    allowMessages: boolean;
    profileVisibility: "public" | "private" | "friends";
  };
}

export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;

    // Granular notification preferences
    preferences: {
      newMessages: boolean;
      friendRequests: boolean;
      systemUpdates: boolean;
      securityAlerts: boolean;
      weeklyDigest: boolean;
    };
  };

  display: {
    theme: "light" | "dark" | "auto";
    language: string;
    timezone: string;
    dateFormat: "MDY" | "DMY" | "YMD";
    timeFormat: "12h" | "24h";
  };

  security: {
    twoFactorEnabled: boolean;
    loginNotifications: boolean;
    sessionTimeout: number;
    trustedDevices: TrustedDevice[];
  };
}

export interface SubscriptionInfo {
  plan: "free" | "basic" | "premium" | "enterprise";
  status: "active" | "cancelled" | "expired" | "pending";
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;

  billing: {
    amount: number;
    currency: string;
    interval: "monthly" | "yearly";
    nextBillingDate?: Date;
  };

  features: {
    storageLimit: number;
    apiCallsLimit: number;
    advancedFeatures: boolean;
    prioritySupport: boolean;
  };
}

export interface Role {
  readonly id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
}

export interface Permission {
  readonly id: string;
  name: string;
  resource: string;
  action: "create" | "read" | "update" | "delete" | "admin";
  scope: "own" | "team" | "organization" | "global";
}

export interface Address {
  readonly id: string;
  type: "home" | "work" | "billing" | "shipping";

  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  isDefault: boolean;
  isActive: boolean;

  // Geolocation
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PaymentMethod {
  readonly id: string;
  type: "credit_card" | "debit_card" | "paypal" | "bank_account";

  // Masked/safe info for display
  displayName: string;
  lastFour: string;
  expiryMonth?: number;
  expiryYear?: number;

  isDefault: boolean;
  isActive: boolean;

  // Billing address
  billingAddress: Omit<Address, "type" | "isDefault">;

  createdAt: Date;
  updatedAt: Date;
}

export interface TrustedDevice {
  readonly id: string;
  name: string;
  deviceType: "desktop" | "mobile" | "tablet";
  browser?: string;
  os?: string;
  ipAddress: string;
  location?: string;
  lastUsed: Date;
  isActive: boolean;
}

export type ExperienceLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

// Additional complex entities for advanced challenges

export interface Organization {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  name: string;
  slug: string;
  description?: string;
  website?: string;
  logo?: string;

  settings: OrganizationSettings;
  subscription: SubscriptionInfo;

  members: OrganizationMember[];
  teams: Team[];
  projects: Project[];
}

export interface OrganizationSettings {
  general: {
    allowPublicProjects: boolean;
    requireTwoFactor: boolean;
    allowGuestInvites: boolean;
  };

  integrations: {
    github: IntegrationConfig;
    slack: IntegrationConfig;
    jira: IntegrationConfig;
  };

  billing: {
    contactEmail: string;
    invoiceSettings: {
      autoSend: boolean;
      ccEmails: string[];
      customMessage?: string;
    };
  };
}

export interface IntegrationConfig {
  enabled: boolean;
  apiKey?: string;
  webhookUrl?: string;
  settings: Record<string, unknown>;
  lastSyncAt?: Date;
}

export interface OrganizationMember {
  readonly id: string;
  user: Pick<User, "id" | "firstName" | "lastName" | "email" | "avatar">;
  role: "owner" | "admin" | "member" | "guest";
  joinedAt: Date;
  invitedBy?: string;
  permissions: string[];
}

export interface Team {
  readonly id: string;
  name: string;
  description?: string;
  color?: string;

  members: Pick<OrganizationMember, "id" | "user" | "role">[];
  projects: string[]; // Project IDs

  settings: {
    isPrivate: boolean;
    defaultRole: "member" | "admin";
    allowExternalCollaborators: boolean;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  readonly id: string;
  name: string;
  description?: string;
  slug: string;

  status: "active" | "archived" | "deleted";
  visibility: "public" | "internal" | "private";

  settings: ProjectSettings;

  owner: Pick<User, "id" | "firstName" | "lastName">;
  collaborators: ProjectCollaborator[];

  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
}

export interface ProjectSettings {
  features: {
    issueTracking: boolean;
    wikiEnabled: boolean;
    discussionsEnabled: boolean;
  };

  integrations: {
    github?: {
      repository: string;
      syncEnabled: boolean;
    };

    deployment?: {
      provider: "vercel" | "netlify" | "aws" | "custom";
      url?: string;
      autoDeployEnabled: boolean;
    };
  };

  permissions: {
    defaultRole: "viewer" | "contributor" | "admin";
    allowForks: boolean;
    allowDownloads: boolean;
  };
}

export interface ProjectCollaborator {
  readonly id: string;
  user: Pick<User, "id" | "firstName" | "lastName" | "email" | "avatar">;
  role: "viewer" | "contributor" | "admin";
  permissions: string[];
  invitedAt: Date;
  acceptedAt?: Date;
}
