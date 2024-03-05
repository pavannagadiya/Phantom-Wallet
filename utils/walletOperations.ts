import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

declare global {
  interface Window {
    solana?: any;
    web3?: any;
  }
}

export const getProvider = () => {
  if (typeof window?.solana !== 'undefined' && window?.solana?.isPhantom) {
    return window.solana;
  }
};

export const getAccounts = async () => {
  try {
    if (
      typeof window !== 'undefined' &&
      typeof window.solana !== 'undefined' &&
      window.solana.isPhantom
    ) {
      const account = await window.solana.connect();
      return account?.publicKey.toString();
    } else {
      throw new Error('Phantom not found! Please install it.');
    }
  } catch (error: any) {
    throw new Error('Error connecting to Phantom. ' + error?.message);
  }
};

export const getBalance = async (userDetails: string) => {
  try {
    if (typeof window.solana !== 'undefined') {
      const connection = new Connection('https://api.devnet.solana.com');
      const publicKey = new PublicKey(userDetails);
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } else {
      throw new Error('Phantom not found! Please install it.');
    }
  } catch (error: any) {
    throw new Error('Error connecting to Phantom. ' + error?.message);
  }
};
