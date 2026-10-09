import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';

export type UserRole = 'traveler' | 'operator';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface AuthResult<T = unknown> {
  data: T | null;
  error: AuthError | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  fullName: string;
  email: string;
  password: string;
  role?: UserRole;
}

// Demo session store for zero-friction evaluation
const DEMO_USERS: Record<UserRole, UserProfile> = {
  traveler: {
    uid: 'traveler-user-1',
    email: 'alex.mercer@itinera.travel',
    displayName: 'Alex Mercer',
    role: 'traveler',
  },
  operator: {
    uid: 'operator-user-1',
    email: 'elena.rostova@operations.itinera.travel',
    displayName: 'Elena Rostova (Operations Alpha)',
    role: 'operator',
  },
};

let activeUser: UserProfile | null = DEMO_USERS.traveler;

export function getActiveSessionUser(): UserProfile | null {
  const cached = localStorage.getItem('itinera_user_session');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return activeUser;
}

export function setActiveSessionUser(user: UserProfile | null): void {
  activeUser = user;
  if (user) {
    localStorage.setItem('itinera_user_session', JSON.stringify(user));
  } else {
    localStorage.removeItem('itinera_user_session');
  }
}

/**
 * Sign in with email and password
 */
export async function login(credentials: LoginCredentials): Promise<AuthResult<UserProfile>> {
  if (isFirebaseConfigured && auth) {
    try {
      const userCred = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const isOp = credentials.email.includes('operator');
      const profile: UserProfile = {
        uid: userCred.user.uid,
        email: userCred.user.email || credentials.email,
        displayName: userCred.user.displayName || credentials.email.split('@')[0],
        role: isOp ? 'operator' : 'traveler',
      };
      setActiveSessionUser(profile);
      return { data: profile, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err.message || 'Firebase login failed.', code: err.code },
      };
    }
  }

  // Demo fallback
  await new Promise((r) => setTimeout(r, 400));
  const isOp = credentials.email.toLowerCase().includes('operator');
  const user = isOp ? DEMO_USERS.operator : DEMO_USERS.traveler;
  setActiveSessionUser(user);
  return { data: user, error: null };
}

/**
 * Create a new account
 */
export async function signup(credentials: SignupCredentials): Promise<AuthResult<UserProfile>> {
  const role: UserRole = credentials.role || (credentials.email.includes('operator') ? 'operator' : 'traveler');

  if (isFirebaseConfigured && auth) {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
      if (userCred.user) {
        await updateProfile(userCred.user, { displayName: credentials.fullName });
      }
      const profile: UserProfile = {
        uid: userCred.user.uid,
        email: userCred.user.email || credentials.email,
        displayName: credentials.fullName,
        role,
      };
      setActiveSessionUser(profile);
      return { data: profile, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err.message || 'Signup failed.', code: err.code },
      };
    }
  }

  // Demo fallback
  await new Promise((r) => setTimeout(r, 400));
  const profile: UserProfile = {
    uid: `user-${Date.now()}`,
    email: credentials.email,
    displayName: credentials.fullName,
    role,
  };
  setActiveSessionUser(profile);
  return { data: profile, error: null };
}

/**
 * Sign out
 */
export async function logout(): Promise<AuthResult<void>> {
  if (isFirebaseConfigured && auth) {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
  }
  setActiveSessionUser(null);
  return { data: null, error: null };
}

/**
 * Reset password
 */
export async function resetPassword(email: string): Promise<AuthResult<void>> {
  if (isFirebaseConfigured && auth) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { data: null, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message, code: err.code } };
    }
  }
  return { data: null, error: null };
}

/**
 * Quick role switcher for testing and demos
 */
export function loginAsDemo(role: UserRole): UserProfile {
  const user = DEMO_USERS[role];
  setActiveSessionUser(user);
  return user;
}
