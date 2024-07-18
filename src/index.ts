import { loadData } from "./helpers";
import {
  createModel,
  predictNextValue,
  prepareData,
  trainModel,
} from "./network";
import * as path from "path";

async function main() {
  const dataFilePath = path.join(process.cwd(), "src", "data", "ETHUSDT.json");
  const data = loadData(dataFilePath);
  const { inputs, outputs } = prepareData(data);

  console.log("Start creating model");
  const model = createModel(inputs.shape[1]);
  console.log("*** Success! Model created!");

  await trainModel(model, inputs, outputs).then(() => {
    console.log("Model trained");
    model.save("file://./model"); // Сохранение модели в файловую систему
  });
  console.log("*** Success! Model learned!");

  // Пример использования модели для прогнозирования
  // const recentData = data.slice(-30).map((d) => d.close);
  const recentData = data.map((d) => d.close);
  const predictedValue = predictNextValue(model, recentData);
  console.log(`Predicted next value: ${predictedValue}`);
}

main();
