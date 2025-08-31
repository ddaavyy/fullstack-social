export interface Profile {
  id: number;
  username: string;
  email: string;
  date_joined: string; 
  photo_url?: string | null;
}

export type MeKey = ['profile', 'me'];
export type ByIdKey = ['profile', number];

export interface ProfileRouteParams {
  id?: string;
}

export interface ProfileFormValues {
  username?: string;
  email?: string;
}

export interface PasswordFormValues {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export type ImageMime = 'image/jpeg' | 'image/jpg' | 'image/png' | 'image/webp';

export interface SimpleUploadRequestOptions {
  file: File;
  onSuccess?: (body?: unknown) => void;
  onError?: (error: Error) => void;
  onProgress?: (evt: { percent: number }) => void;
}