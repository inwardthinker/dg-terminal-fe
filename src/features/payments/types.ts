export type Payment = {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
};
