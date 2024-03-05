'use client';
import { getAccounts, getBalance, getProvider } from '@/utils/walletOperations';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [userAccount, setUserAccount] = useState<string | null>(null);

  const setAccountAddress = (address: string) => {
    setUserAccount(address ? address : null);
  };

  useEffect(() => {
    const userDetails = localStorage.getItem('SkypilotsPhantomAccount');

    const fetchBalance = async () => {
      try {
        if (userDetails) {
          setIsWalletConnected(true);
          const accountBalance = await getBalance(userDetails);
          setBalance(accountBalance as number);
          setAccountAddress(userDetails);
        } else {
          setUserAccount(null);
          setIsWalletConnected(false);
        }
      } catch (error) {
        handleErrors(error);
      }
    };

    fetchBalance();
  }, []);

  const provider = getProvider();

  useEffect(() => {
    if (provider) {
      provider.on('accountChanged', async (publicKey: any) => {
        if (publicKey) {
          return await handleWalletAction();
        }
        if (!isWalletConnected && !publicKey) {
          return await handleWalletAction();
        }
      });
    }
  }, []);

  const handleErrors = (error: any) => {
    alert(error?.message || 'An error occurred.');
  };

  const handleWalletAction = async () => {
    try {
      if (isWalletConnected) {
        await provider.request({ method: 'disconnect' });
        localStorage.removeItem('PhantomAccount');
        setUserAccount(null);
        setBalance(0);
        return setIsWalletConnected(false);
      } else {
        const accounts = await getAccounts();
        if (accounts) {
          localStorage.setItem('PhantomAccount', accounts);
          setAccountAddress(accounts);
          const accountBalance = await getBalance(accounts);
          setBalance(accountBalance as number);
          return setIsWalletConnected(true);
        }
      }
    } catch (error) {
      handleErrors(error);
      localStorage.removeItem('PhantomAccount');
      setIsWalletConnected(false);
      setUserAccount(null);
    }
  };

  return (
    <main className="min-h-screen items-center justify-between p-24">
      <div><h1><b>You need to open it into "Open Preview in new tab"</b></h1></div>
      <br />
      <p>In this example I added bellow points</p>
      <ul>
        <li>1.)Connect with Phantom wallet.</li>
        <li>
          2.)Get account public-key or wallet id of currently connected account.
        </li>
        <li>3.)Get account balance of currently connected account.</li>
        <li>4.)Managed multiple account.</li>
        <li>5.)Handle account change event.</li>
        <li>6.)I have stored account address into browser's localstorage.</li>
        <li>7.)Library I used @solana/web3.js.</li>
      </ul>
      <br />
      <hr />
      <br />
      <div>
        <h1>PhantomWallet</h1>
      </div>
      <div>
        <button
          style={{ background: 'white', color: 'black' }}
          onClick={handleWalletAction}
        >
          {isWalletConnected ? 'Disconnect' : 'Click Me'}
        </button>
      </div>
      <div>userAddressIs:- {userAccount}</div>
      <div>userBalanceIs:- {balance}</div>
    </main>
  );
}
