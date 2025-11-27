import { useState, useEffect } from "react";
import { useTokenPrices } from "../hooks/useTokenPrices";
import TokenSelector from "./TokenSelector";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify";

const SwapForm = () => {
  const { tokens, loading: pricesLoading, error } = useTokenPrices();

  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapError, setSwapError] = useState("");

  const [iconCache, setIconCache] = useState({});

  const [openDropdown, setOpenDropdown] = useState(null); // null, 'from', or 'to'

  useEffect(() => {
    if (
      fromToken &&
      toToken &&
      fromAmount &&
      !isNaN(fromAmount) &&
      parseFloat(fromAmount) > 0
    ) {
      const rate = fromToken.price / toToken.price;
      const calculatedAmount = parseFloat(fromAmount) * rate;
      setToAmount(calculatedAmount.toFixed(6));
      setSwapError("");
    } else {
      setToAmount("");
    }
  }, [fromToken, toToken, fromAmount]);

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
  };

  const handleImageError = (currency, iconUrl) => {
    if (!iconCache[currency] || !iconCache[currency].isFallback) {
      setIconCache((prev) => ({
        ...prev,
        [currency]: {
          src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiNmMWYxZjEiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNlNWU1ZTUiLz4KPHN2ZyB4PSI1IiB5PSI1IiB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzk5OTk5OSI+CjxwYXRoIGQ9Ik0xMC44IDYuMjhjMC0xLjIuNzgtMS45NiAyLjA2LTEuOTYgMS4yOCAwIDIuMDYuNzYgMi4wNiAxLjk2IDAgMS4yLS43OCAxLjk3LTIuMDYgMS45Ny0xLjI4IDAtMi4wNi0uNzctMi4wNi0xLjk3em0tLjM3IDUuNThoMi4yN3Y3Ljg3aC0yLjI3di03Ljg3eiIvPgo8L3N2Zz4KPC9zdmc+",
          isFallback: true,
        },
      }));
    }
  };

  const getIconSrc = (token) => {
    if (!token) return "";
    if (iconCache[token.currency]?.isFallback) {
      return iconCache[token.currency].src;
    }
    return token.icon;
  };

  const handleDropdownToggle = (dropdownType) => {
    if (openDropdown === dropdownType) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdownType);
    }
  };

  const handleDropdownClose = () => {
    setOpenDropdown(null);
  };

  const handleTokenSelect = (token, type) => {
    if (type === "from") {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setOpenDropdown(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fromToken || !toToken || !fromAmount || parseFloat(fromAmount) <= 0) {
      setSwapError("Please fill in all fields with valid amounts");
      return;
    }

    if (fromToken.currency === toToken.currency) {
      setSwapError("Cannot swap the same token");
      return;
    }

    setIsSwapping(true);
    setSwapError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (Math.random() > 0.1) {
        toast.success(
          `Success! Swapped ${fromAmount} ${fromToken.currency} for ${toAmount} ${toToken.currency}`
        );

        setFromAmount("");
        setToAmount("");
      } else {
        toast.error("Transaction failed. Please try again.");
        throw new Error("Transaction failed. Please try again.");
      }
    } catch (err) {
      setSwapError(err.message || "Transaction failed. Please try again.");
    } finally {
      setIsSwapping(false);
    }
  };

  const exchangeRate =
    fromToken && toToken
      ? `1 ${fromToken.currency} = ${(fromToken.price / toToken.price).toFixed(
          6
        )} ${toToken.currency}`
      : "";

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Currency Swap</h1>
        <p className="text-gray-600">Exchange tokens instantly</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TokenSelector
          tokens={tokens}
          selectedToken={fromToken}
          onTokenSelect={(token) => handleTokenSelect(token, "from")}
          amount={fromAmount}
          onAmountChange={setFromAmount}
          loading={pricesLoading}
          label="You pay"
          // Pass cache-related props
          iconCache={iconCache}
          onImageError={handleImageError}
          getIconSrc={getIconSrc}
          // Dropdown management
          dropdownType="from"
          openDropdown={openDropdown}
          onDropdownToggle={handleDropdownToggle}
          onDropdownClose={handleDropdownClose}
        />

        <div className="flex justify-center -my-2">
          <button
            type="button"
            onClick={handleSwapTokens}
            className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full p-2 transition-colors z-10"
            disabled={!fromToken || !toToken}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </button>
        </div>

        <TokenSelector
          tokens={tokens}
          selectedToken={toToken}
          onTokenSelect={(token) => handleTokenSelect(token, "to")}
          amount={toAmount}
          onAmountChange={setToAmount}
          loading={pricesLoading}
          readOnly={true}
          label="You receive"
          iconCache={iconCache}
          onImageError={handleImageError}
          getIconSrc={getIconSrc}
          dropdownType="to"
          openDropdown={openDropdown}
          onDropdownToggle={handleDropdownToggle}
          onDropdownClose={handleDropdownClose}
        />

        {exchangeRate && (
          <div className="text-center text-sm text-gray-600 bg-gray-50 py-2 rounded-lg">
            {exchangeRate}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {swapError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {swapError}
          </div>
        )}

        <button
          type="submit"
          disabled={
            isSwapping ||
            !fromToken ||
            !toToken ||
            !fromAmount ||
            parseFloat(fromAmount) <= 0
          }
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isSwapping ? (
            <>
              <LoadingSpinner size="small" />
              <span>Swapping...</span>
            </>
          ) : (
            <span>{!fromToken || !toToken ? "Select tokens" : "Swap"}</span>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-blue-700">
            <p className="font-medium">How it works</p>
            <p className="mt-1">
              Select the tokens you want to swap. The exchange rate is
              calculated automatically based on current market prices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapForm;
