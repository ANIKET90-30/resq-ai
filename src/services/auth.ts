import { DBService } from './db';
import { User } from '../types';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export class AuthService {
  static getCurrentUser(): User | null {
    return DBService.getCurrentUser();
  }

  static async login(email: string, password?: string): Promise<User> {
    // Simulate auth network latency
    await new Promise((r) => setTimeout(r, 400));
    
    const users = DBService.getUsers();
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Create new user if not found for seamless demo
      user = {
        id: 'usr-' + Date.now(),
        email: email,
        fullName: email.split('@')[0].replace('.', ' ').toUpperCase(),
        role: email.includes('admin') ? 'admin' : email.includes('ngo') ? 'ngo' : 'user',
        createdAt: new Date().toISOString(),
      };
      users.push(user);
    }

    DBService.setCurrentUser(user);
    DBService.addAuditLog(user.id, 'AUTH_LOGIN', `User ${user.email} logged in`);
    return user;
  }

  static async signup(fullName: string, email: string, password?: string, role: 'user' | 'responder' | 'ngo' = 'user'): Promise<User> {
    await new Promise((r) => setTimeout(r, 400));

    const user: User = {
      id: 'usr-' + Date.now(),
      email,
      fullName,
      role,
      createdAt: new Date().toISOString(),
    };

    DBService.setCurrentUser(user);
    DBService.addAuditLog(user.id, 'AUTH_SIGNUP', `Registered account for ${email}`);
    return user;
  }

  static async logout(): Promise<void> {
    const current = DBService.getCurrentUser();
    if (current) {
      DBService.addAuditLog(current.id, 'AUTH_LOGOUT', 'User logged out');
    }
    DBService.setCurrentUser(null);
  }

  static async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    await new Promise((r) => setTimeout(r, 300));
    return {
      success: true,
      message: `Password reset link has been sent to ${email}`,
    };
  }
}
