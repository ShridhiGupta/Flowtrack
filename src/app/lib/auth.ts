export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  walletAddress?: string;
  createdAt: string;
}

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('user') !== null;
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  return JSON.parse(userStr);
};

export const login = (email: string, password: string): User | null => {
  // Mock login - in production, this would call an API
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: any) => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }
  return null;
};

export const register = (name: string, email: string, password: string, role: string): User => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  const newUser = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    password,
    role,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  const { password: _, ...userWithoutPassword } = newUser;
  localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  return userWithoutPassword;
};

export const connectWallet = async (): Promise<string | null> => {
  // Mock wallet connection - in production, this would use MetaMask
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      // Mock wallet address
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      return mockAddress;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return null;
    }
  }
  // For demo purposes, return a mock address
  return '0x' + Math.random().toString(16).substr(2, 40);
};

export const logout = (): void => {
  localStorage.removeItem('user');
};
