import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const TokenSelector = ({
  tokens,
  selectedToken,
  onTokenSelect,
  amount,
  onAmountChange,
  loading = false,
  readOnly = false,
  label,
  onImageError,
  getIconSrc,
  dropdownType,
  openDropdown,
  onDropdownToggle,
  onDropdownClose,
}) => {
  const isOpen = openDropdown === dropdownType;

  const handleTokenSelect = (token) => {
    onTokenSelect(token);
  };

  const handleButtonClick = () => {
    onDropdownToggle(dropdownType);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".token-selector-dropdown")) {
        onDropdownClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onDropdownClose]);

  return (
    <div className="token-selector token-selector-dropdown">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="flex gap-3">
        <div className="flex-1">
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.0"
            readOnly={readOnly}
            className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={handleButtonClick}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 min-w-[120px]"
          >
            {selectedToken ? (
              <>
                <img
                  src={getIconSrc(selectedToken)}
                  alt={selectedToken.currency}
                  className="w-6 h-6 rounded-full"
                  onError={() =>
                    onImageError(selectedToken.currency, selectedToken.icon)
                  }
                />
                <span className="font-medium">{selectedToken.currency}</span>
              </>
            ) : (
              <span className="text-gray-500">Select token</span>
            )}
            <svg
              className={`w-4 h-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center p-4">
                  <LoadingSpinner size="small" />
                </div>
              ) : (
                tokens.map((token, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleTokenSelect(token)}
                    className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 text-left"
                  >
                    <img
                      src={getIconSrc(token)}
                      alt={token.currency}
                      className="w-6 h-6 rounded-full"
                      onError={() => onImageError(token.currency, token.icon)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{token.currency}</div>
                      <div className="text-sm text-gray-500">
                        ${token.price.toFixed(4)}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenSelector;
