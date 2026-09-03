/** South African bond calculator defaults (update when prime moves). */
export const BOND_DEFAULTS = {
  annualRate: 11.75,
  termYears: 20,
  depositPercent: 10,
  incomeRatio: 0.3,
} as const;

export type BondRepaymentInput = {
  price: number;
  deposit: number;
  annualRate: number;
  termYears: number;
};

export type BondRepaymentResult = {
  loanAmount: number;
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
};

export type AffordabilityInput = {
  grossIncome: number;
  existingDebt: number;
  deposit: number;
  annualRate: number;
  termYears: number;
  incomeRatio?: number;
};

export type AffordabilityResult = {
  maxInstalment: number;
  maxLoanAmount: number;
  maxPurchasePrice: number;
};

export function formatZar(amount: number): string {
  if (!Number.isFinite(amount)) return "R0";
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

function monthlyPaymentFromLoan(
  loanAmount: number,
  annualRate: number,
  termYears: number,
): number {
  if (loanAmount <= 0) return 0;

  const months = termYears * 12;
  if (months <= 0) return 0;

  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return loanAmount / months;

  const factor = (1 + monthlyRate) ** months;
  return (loanAmount * monthlyRate * factor) / (factor - 1);
}

function maxLoanFromPayment(
  monthlyPayment: number,
  annualRate: number,
  termYears: number,
): number {
  if (monthlyPayment <= 0) return 0;

  const months = termYears * 12;
  if (months <= 0) return 0;

  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return monthlyPayment * months;

  const factor = (1 + monthlyRate) ** months;
  return (monthlyPayment * (factor - 1)) / (monthlyRate * factor);
}

export function calculateBondRepayment(
  input: BondRepaymentInput,
): BondRepaymentResult {
  const loanAmount = Math.max(0, input.price - input.deposit);
  const monthlyPayment = monthlyPaymentFromLoan(
    loanAmount,
    input.annualRate,
    input.termYears,
  );
  const months = input.termYears * 12;
  const totalPaid = monthlyPayment * months;
  const totalInterest = Math.max(0, totalPaid - loanAmount);

  return {
    loanAmount,
    monthlyPayment,
    totalPaid,
    totalInterest,
  };
}

export function calculateAffordability(
  input: AffordabilityInput,
): AffordabilityResult {
  const ratio = input.incomeRatio ?? BOND_DEFAULTS.incomeRatio;
  const maxInstalment = Math.max(
    0,
    input.grossIncome * ratio - input.existingDebt,
  );
  const maxLoanAmount = maxLoanFromPayment(
    maxInstalment,
    input.annualRate,
    input.termYears,
  );
  const maxPurchasePrice = maxLoanAmount + input.deposit;

  return {
    maxInstalment,
    maxLoanAmount,
    maxPurchasePrice,
  };
}

export function defaultDepositForPrice(price: number): number {
  return Math.round(price * (BOND_DEFAULTS.depositPercent / 100));
}
