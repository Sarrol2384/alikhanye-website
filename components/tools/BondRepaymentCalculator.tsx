"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalculatorResult } from "@/components/tools/CalculatorResult";
import {
  BOND_DEFAULTS,
  calculateBondRepayment,
  defaultDepositForPrice,
  formatZar,
} from "@/lib/calculators/bond";

function parseAmount(value: string): number {
  const parsed = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

const DEFAULT_PRICE = 1_500_000;

export function BondRepaymentCalculator() {
  const [price, setPrice] = useState(String(DEFAULT_PRICE));
  const [deposit, setDeposit] = useState(
    String(defaultDepositForPrice(DEFAULT_PRICE)),
  );
  const [annualRate, setAnnualRate] = useState(String(BOND_DEFAULTS.annualRate));
  const [termYears, setTermYears] = useState(String(BOND_DEFAULTS.termYears));

  const result = useMemo(
    () =>
      calculateBondRepayment({
        price: parseAmount(price),
        deposit: parseAmount(deposit),
        annualRate: parseAmount(annualRate),
        termYears: parseAmount(termYears),
      }),
    [price, deposit, annualRate, termYears],
  );

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="font-heading text-2xl text-primary">Bond repayment</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Estimate your monthly home loan repayment based on purchase price,
        deposit, interest rate, and term.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bond-price">Purchase price (R)</Label>
          <Input
            id="bond-price"
            type="number"
            min={0}
            step={10000}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bond-deposit">Deposit (R)</Label>
          <Input
            id="bond-deposit"
            type="number"
            min={0}
            step={10000}
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bond-rate">Interest rate (% p.a.)</Label>
          <Input
            id="bond-rate"
            type="number"
            min={0}
            max={30}
            step={0.01}
            value={annualRate}
            onChange={(e) => setAnnualRate(e.target.value)}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bond-term">Term (years)</Label>
          <Input
            id="bond-term"
            type="number"
            min={1}
            max={30}
            step={1}
            value={termYears}
            onChange={(e) => setTermYears(e.target.value)}
            className="h-10"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <CalculatorResult
          label="Estimated monthly repayment"
          value={formatZar(result.monthlyPayment)}
          highlight
        />
        <CalculatorResult
          label="Loan amount"
          value={formatZar(result.loanAmount)}
        />
        <CalculatorResult
          label="Total interest over term"
          value={formatZar(result.totalInterest)}
        />
        <CalculatorResult
          label="Total amount repaid"
          value={formatZar(result.totalPaid)}
        />
      </div>
    </div>
  );
}
