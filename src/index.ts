import { getBybitOHLC } from "./collect-data";
import { getStartTime, saveDataToFile } from "./helpers";

async function main() {
  const symbol = "ETHUSDT";
  const interval = "D"; // 1, 3, 5, 15, 30, 60, 120, 240, 360, 720, D, W, M
  const startTime = getStartTime(3); // Вы можете заменить это на конкретную дату
  const ohlcData = await getBybitOHLC(symbol, interval, startTime);
  saveDataToFile(ohlcData, symbol);
  console.log(
    `Success. Data for ${symbol}, interval: ${interval} have been saved`
  );
}

main();
