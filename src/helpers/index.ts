import * as fs from "fs";
import * as path from "path";
import { OHLC } from "@/types";

export const getStartTime = (daysAgo: number): string => {
  const now = new Date();
  const pastDate = new Date(now.setDate(now.getDate() - daysAgo));
  return pastDate.getTime().toString();
};

export const saveDataToFile = (data: OHLC[], filename: string): void => {
  const dir = path.join(process.cwd(), "src", "data");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `${filename}.json`);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Data has been saved to ${filePath}`);
};
