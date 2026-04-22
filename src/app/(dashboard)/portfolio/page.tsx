import PortfolioContainer from "@/features/portfolio/components/containers/PortfolioContainer";

const MOCK_WALLET_ADDRESS = "0x798a7921f5b2c684ecbaa7a6ae216a819fa6cc72";

export default function PortfolioPage() {
  return (
    <PortfolioContainer userWalletAddress={MOCK_WALLET_ADDRESS} />
  );
}
