import { Transaction, Deal } from "../types/payment";

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    type: "Deposit",
    amount: 10000,
    sender: "Bank Account ****4521",
    receiver: "My Wallet",
    status: "Completed",
    date: "Mar 10, 2026",
    description: "Initial deposit",
  },
  {
    id: 2,
    type: "FundDeal",
    amount: 5000,
    sender: "My Wallet",
    receiver: "TechStartup Inc.",
    status: "Completed",
    date: "Mar 11, 2026",
    description: "Series A investment",
  },
  {
    id: 3,
    type: "Transfer",
    amount: 2000,
    sender: "My Wallet",
    receiver: "john.investor@email.com",
    status: "Pending",
    date: "Mar 13, 2026",
    description: "Co-investor split",
  },
  {
    id: 4,
    type: "Withdraw",
    amount: 1500,
    sender: "My Wallet",
    receiver: "Bank Account ****4521",
    status: "Completed",
    date: "Mar 14, 2026",
    description: "Monthly withdrawal",
  },
  {
    id: 5,
    type: "Deposit",
    amount: 3000,
    sender: "PayPal ****8832",
    receiver: "My Wallet",
    status: "Failed",
    date: "Mar 15, 2026",
    description: "Top up attempt",
  },
];

export const MOCK_DEALS: Deal[] = [
  { id: "d1", title: "TechStartup Inc.",  founder: "Ali Hassan",   target: 50000, raised: 22000 },
  { id: "d2", title: "GreenEnergy Co.",   founder: "Sara Khan",    target: 80000, raised: 41000 },
  { id: "d3", title: "EduPlatform Ltd.",  founder: "Omar Farooq",  target: 30000, raised: 9000  },
];