'use client';

import { BridgeButton,BridgeAndExecuteButton, TOKEN_METADATA,TOKEN_CONTRACT_ADDRESSES  } from '@avail-project/nexus-widgets';
import { ConnectKitButton } from 'connectkit';
import { useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { NexusProvider } from '@avail-project/nexus-widgets';

export function BridgeTest() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ConnectKitButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <h1 className="text-2xl font-bold">Test Cross-Chain Bridge</h1>
      
      
      <BridgeButton
        prefill={{
          chainId: 421614, // Arbitrum Sepolia (testnet)
          token: 'USDC',
          amount: '1', // 1 USDC
        }}
      >
        {({ onClick, isLoading }) => (
          <button
            onClick={onClick}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Bridging...' : 'Bridge 1 USDC to Arbitrum Sepolia'}
          </button>
        )}
      </BridgeButton>
       <BridgeAndExecuteButton
          contractAddress="0x794a61358D6845594F94dc1DB02A252b5b4814aD"
          contractAbi={
        [
        {
        name: 'supply',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'asset', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'onBehalfOf', type: 'address' },
          { name: 'referralCode', type: 'uint16' },
        ],
        outputs: [],
      },
    ] as const
  }
  functionName="supply"
  buildFunctionParams={(token, amount, chainId, userAddress) => {
    const decimals = TOKEN_METADATA[token].decimals;
    const amountWei = parseUnits(amount, decimals);
    const tokenAddress = TOKEN_CONTRACT_ADDRESSES[token][chainId];
    return {
      functionParams: [tokenAddress, amountWei, userAddress, 0],
    };
  }}
  prefill={{ toChainId: 1, token: 'USDC' }}
>
  {({ onClick, isLoading, disabled }) => (
    <button onClick={onClick} disabled={isLoading || disabled}>
      {isLoading ? 'Processing…' : 'Bridge & Supply to Aave'}
    </button>
  )}
      </BridgeAndExecuteButton>

      <p className="text-sm text-gray-600">
        This will bridge USDC from your current chain to Arbitrum Sepolia testnet
      </p>
    </div>
  );
}