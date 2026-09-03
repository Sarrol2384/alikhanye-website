"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalculatorResult } from "@/components/tools/CalculatorResult";
import {
  BOND_DEFAULTS,
  calculateAffordability,
  formatZar,
} from "@/lib/calculators/bond";

function parseAmount(value: string): number {
  const parsed = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

export function AffordabilityCalculator() {
  const [grossIncome, setGrossIncome] = useState("35000");
  const [existingDebt, setExistingDebt] = useState("0");
  const [deposit, setDeposit] = useState("150000");
  const [annualRate, setAnnualRate] = useState(String(BOND_DEFAULTS.annualRate));
  const [termYears, setTermYears] = useState(String(BOND_DEFAULTS.termYears));

  const result = useMemo(
    () =>
      calculateAffordability({
        grossIncome: parseAmount(grossIncome),
        existingDebt: parseAmount(existingDebt),
        deposit: parseAmount(deposit),
        annualRate: parseAmount(annualRate),
        termYears: parseAmount(termYears),
      }),
    [grossIncome, existingDebt, deposit, annualRate, termYears],
  );

  const incomeRatioPercent = Math.round(BOND_DEFAULTS.incomeRatio * 100);

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="font-heading text-2xl text-primary">Affordability</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Estimate what you may afford using a {incomeRatioPercent}% rule of thumb
        on gross monthly income, minus existing debt repayments.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="afford-income">Gross monthly income (R)</Label>
          <Input
            id="afford-income"
            type="number"
            min={0}
            step={1000}
            value={grossIncome}
            onChange={(e) => setGrossIncome(e.target.value)}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="afford-debt">Existing monthly debt (R)</Label>
          <Input
            id="afford-debt"
            type="number"
            min={0}
            step={100}
            value={existingDebt}
            onChange={(e) => setExistingDebt(e.target.value)}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="afford-deposit">Deposit saved (R)</Label>
          <Input
            id="afford-deposit"
            type="number"
            min={0}
            step={10000}
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="afford-rate">Interest rate (% p.a.)</Label>
          <Input
            id="afford-rate"
            type="number"
            min={0}
            max={30}
            step={0.01}
            value={annualRate}
            onChange={(e) => setAnnualRate(e.target.value)}
            className="h-10"
          />
        </div>
        <div className="space-y-2 sm:col-span-2 sm:max-w-[calc(50%-0.5rem)]">
          <Label htmlFor="afford-term">Term (years)</Label>
          <Input
            id="afford-term"
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
          label="Estimated max purchase price"
          value={formatZar(result.maxPurchasePrice)}
          highlight
        />
        <CalculatorResult
          label="Estimated max bond amount"
          value={formatZar(result.maxLoanAmount)}
        />
        <CalculatorResult
          label="Affordable monthly instalment"
          value={formatZar(result.maxInstalment)}
        />
      </div>
    </div>
  );
}
