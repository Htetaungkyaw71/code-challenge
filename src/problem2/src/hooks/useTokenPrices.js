import { useState, useEffect } from "react";

const TOKEN_ICONS_BASE_URL =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens";
const PRICES_URL = "https://interview.switcheo.com/prices.json";

export const useTokenPrices = () => {
  const [prices, setPrices] = useState({});
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await fetch(PRICES_URL);
        const priceData = await response.json();

        const priceMap = {};
        const tokenList = [];

        priceData.forEach((token) => {
          if (token.currency && token.price) {
            priceMap[token.currency] = token.price;
            tokenList.push({
              currency: token.currency,
              price: token.price,
              icon: `${TOKEN_ICONS_BASE_URL}/${token.currency}.svg`,
            });
          }
        });

        setPrices(priceMap);
        setTokens(tokenList);
        setError(null);
      } catch (err) {
        setError("Failed to fetch token prices");
        console.error("Error fetching prices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  return { prices, tokens, loading, error };
};
