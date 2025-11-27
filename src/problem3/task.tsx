import { useMemo } from "react";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // 1 Issue:  Added missing property
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
} as const;

type Blockchain = keyof typeof BLOCKCHAIN_PRIORITIES;

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    return BLOCKCHAIN_PRIORITIES[blockchain as Blockchain] ?? -99;
  };

  const sortedAndFormattedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // 2 Issue: The filter returns true when balance is ≤ 0 (negative/zero balances), which is incorrect. It should filter out negative/zero balances. Also, lhsPriority is undefined.

        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        if (leftPriority > rightPriority) return -1;
        if (rightPriority > leftPriority) return 1;
        // 3 Issue: When priorities are equal, no return value (undefined) breaks stable sorting.

        return 0;
      })
      .map(
        (balance: WalletBalance): FormattedWalletBalance => ({
          ...balance,
          formatted: balance.amount.toFixed(),
        })
      );
    // 4 Issue: prices is included in dependencies but never used inside the memo, causing unnecessary re-computations.
  }, [balances]); //  Removed unnecessary prices dependency

  // 5 Issue: formattedBalances is computed but never used, while sortedBalances (without formatting) is used for rendering.

  const rows = sortedAndFormattedBalances.map(
    (balance: FormattedWalletBalance) => {
      const usdValue = prices[balance.currency] * balance.amount;

      return (
        <WalletRow
          className={classes.row}
          // 6 Issue: Using array index as React key can cause performance issues and bugs during re-renders, especially when list order changes.
          key={balance.currency + balance.blockchain} // Unique key
          amount={balance.amount}
          usdValue={usdValue || 0} // 7 Issue: Handle missing prices
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};

// Explanation

// 1 Issue:  Added missing property
// 2 Issue: The filter returns true when balance is ≤ 0 (negative/zero balances), which is incorrect. It should filter out negative/zero balances. Also, lhsPriority is undefined.
// 3 Issue: When priorities are equal, no return value (undefined) breaks stable sorting.
// 4 Issue: prices is included in dependencies but never used inside the memo, causing unnecessary re-computations.
// 5 Issue: formattedBalances is computed but never used, while sortedBalances (without formatting) is used for rendering.
// 6 Issue: Using array index as React key can cause performance issues and bugs during re-renders, especially when list order changes.
// 7 Issue: Handle missing prices
