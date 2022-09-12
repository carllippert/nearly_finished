import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig, Chain } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import type { AppProps } from 'next/app';

const auroraChain: Chain = {
  id: 1313161555,
  name: 'Aurora Testnet',
  network: 'aurora',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: 'https://testnet.aurora.dev/',
  },
  blockExplorers: {
    default: { name: 'Aurorascan', url: 'https://testnet.aurorascan.dev/' },
  },
  testnet: true,
}

const { chains, provider } = configureChains(
  [auroraChain],
  [
    jsonRpcProvider({ rpc: () => ({ http: 'https://testnet.aurora.dev/' }) }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
