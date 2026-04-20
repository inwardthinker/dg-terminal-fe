import PortfolioContainer from "@/features/portfolio/components/containers/PortfolioContainer";

const MOCK_WALLET_ADDRESS = "0x7fC25f4f0f01f3B3f3D184E96dD4907Bc4F3A7d1";

export default function PortfolioPage() {
  return (
    <PortfolioContainer userWalletAddress={MOCK_WALLET_ADDRESS} />
  );
}
