import axios from "axios";

interface OHLC {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

const getStartTime = (daysAgo: number): string => {
  const now = new Date();
  const pastDate = new Date(now.setDate(now.getDate() - daysAgo));
  return pastDate.getTime().toString();
};

const getBybitOHLC = async (
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

// Пример использования функции
(async () => {
  const symbol = "ETHUSDT";
  const interval = "D"; // 1, 3, 5, 15, 30, 60, 120, 240, 360, 720, D, W, M
  const startTime = getStartTime(3); // Вы можете заменить это на конкретную дату
  const ohlcData = await getBybitOHLC(symbol, interval, startTime);
  console.log(ohlcData);
})();
