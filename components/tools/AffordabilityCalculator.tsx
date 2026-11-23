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
  const [annualRate, setAnnualRate] = useState(String(BOND_DEFAULTS.annualRate));
  const [termYears, setTermYears] = useState(String(BOND_DEFAULTS.termYears));

  const result = useMemo(
    () =>
      calculateAffordability({
        grossIncome: parseAmount(grossIncome),
        existingDebt: parseAmount(existingDebt),
        annualRate: parseAmount(annualRate),
        termYears: parseAmount(termYears),
      }),
    [grossIncome, existingDebt, annualRate, termYears],
  );

  const incomeRatioPercent = Math.round(BOND_DEFAULTS.incomeRatio * 100);
  const blockedByExpenses =
    result.incomeAllowance > 0 && result.maxInstalment === 0;

  return (
    <div
      id="affordability"
      className="scroll-mt-28 rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      <h2 className="font-heading text-2xl text-primary">Bond affordability</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        A rough figure using the {incomeRatioPercent}% of gross income rule.
        Enter one income, or add both together if you are applying jointly.
        The interest rate starts at the current prime rate (
        {BOND_DEFAULTS.annualRate}%).
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="afford-income">
            Gross monthly income, single or joint (R)
          </Label>
          <Input
            id="afford-income"
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={grossIncome}
            onChange={(e) => setGrossIncome(e.target.value)}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="afford-debt">Monthly expenses and debts (R)</Label>
          <Input
            id="afford-debt"
            type="number"
            min={0}
            step={100}
            inputMode="decimal"
            value={existingDebt}
            onChange={(e) => setExistingDebt(e.target.value)}
            className="h-10"
          />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Car payments, loans, store accounts and other amounts you already
            pay. Leave out the new bond.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="afford-rate">Interest rate (% a year)</Label>
          <Input
            id="afford-rate"
            type="number"
            min={0}
            max={30}
            step={0.01}
            inputMode="decimal"
            value={annualRate}
            onChange={(e) => setAnnualRate(e.target.value)}
            className="h-10"
          />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Prefilled with prime. Change it if the bank quoted another rate.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="afford-term">Term (years)</Label>
          <Input
            id="afford-term"
            type="number"
            min={1}
            max={30}
            step={1}
            inputMode="numeric"
            value={termYears}
            onChange={(e) => setTermYears(e.target.value)}
            className="h-10"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <CalculatorResult
          label="Maximum monthly repayment"
          value={formatZar(result.maxInstalment)}
          highlight
        />
        <CalculatorResult
          label="Maximum bond amount"
          value={formatZar(result.maxLoanAmount)}
        />
        <CalculatorResult
          label={`${incomeRatioPercent}% of gross income`}
          value={formatZar(result.incomeAllowance)}
        />
      </div>

      {blockedByExpenses ? (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          On these figures, the expenses and debts you entered already use up
          the {incomeRatioPercent}% guideline, so there is nothing left for a
          bond repayment.
        </p>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        This is a guide only, not a bond quotation and not financial advice.
        Banks look at your credit record, the property and their own rules.
        Prime and the rate you are offered can change. Phone Wendy if you want
        to talk the numbers through.
      </p>
    </div>
  );
}
