'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useNexus } from '@avail-project/nexus-widgets';

export function WalletBridge() {
  const { connector, isConnected } = useAccount();
  const { setProvider, initializeSdk, isSdkInitialized } = useNexus();
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    const initializeNexus = async () => {
      if (isConnected && connector?.getProvider && !isSdkInitialized && !isInitializing) {
        try {
          setIsInitializing(true);
          console.log('Getting wallet provider...');
          const provider = await connector.getProvider() as any;
          console.log('Provider obtained:', provider);
          
         
          console.log('Setting provider...');
          setProvider(provider);
          
         
          await new Promise(resolve => setTimeout(resolve, 100));
        
          console.log('Initializing SDK...');
          await initializeSdk(provider);
          
          console.log('Nexus SDK initialized successfully');
        } catch (error) {
          console.error('Failed to initialize Nexus SDK:', error);
          if (error && typeof error === 'object') {
            console.error('Error details:', {
              message: (error as { message?: string }).message,
              stack: (error as { stack?: string }).stack,
              name: (error as { name?: string }).name
            });
          } else {
            console.error('Error details:', error);
          }
        } finally {
          setIsInitializing(false);
        }
      }
    };

    initializeNexus();
  }, [isConnected, connector, isSdkInitialized, setProvider, initializeSdk]);

  if (isInitializing) {
    return (
      <div className="fixed top-4 right-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-lg">
        Initializing Nexus SDK...
      </div>
    );
  }

  if (isSdkInitialized) {
    return (
      <div className="fixed top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg">
        Nexus SDK Ready ✓
      </div>
    );
  }

  return null;
}