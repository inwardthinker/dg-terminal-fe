import PortfolioContainer from "@/features/portfolio/components/containers/PortfolioContainer";

const MOCK_WALLET_ADDRESS = "0xF17d0707cAaF62f925D113B0053960994B2C40BC";

export default function PortfolioPage() {
  return (
    <PortfolioContainer userWalletAddress={MOCK_WALLET_ADDRESS} />
  );
}
