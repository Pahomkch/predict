import axios from "axios";
import { OHLC } from "@/types";

/**
 *
 * @param symbol
 * @param interval
 * @param startTime
 * @returns
 */

export const getBybitOHLC = async (
  symbol: string,
  interval: string,
  startTime: string
): Promise<OHLC[]> => {
  const url = "https://api.bybit.com/v5/market/kline";
  const params = {
    category: "linear",
    symbol: symbol,
    interval: interval,
    start: startTime,
    limit: 5,
  };

  try {
    const response = await axios.get(url, { params });
    const data = response.data.result.list;

    const ohlcData: OHLC[] = data.map((item: any) => {
      const localDate = new Date(parseInt(item[0], 10)).toLocaleString(
        "en-US",
        { timeZone: "Asia/Bangkok" }
      );

      return {
        timestamp: localDate,

        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
      };
    });

    return ohlcData;
  } catch (error) {
    console.error("Error fetching data from Bybit API", error);
    return [];
  }
};
