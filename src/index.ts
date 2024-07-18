import { loadData } from "./helpers";
import {
  createModel,
  predictNextValue,
  prepareData,
  trainModel,
} from "./network";
import * as path from "path";
import * as tf from "@tensorflow/tfjs-node";

async function main() {
  const dataFilePath = path.join(process.cwd(), "src", "data", "ETHUSDT.json");
  const data = loadData(dataFilePath);
  const { inputs, outputs, minPrice, maxPrice } = prepareData(data); // Подготовка данных

  console.log("Start creating model");
  const model = createModel(inputs.shape[1]);

  await trainModel(model, inputs, outputs).then(() => {
    console.log("Model trained");
    model.save("file://./model"); // Сохранение модели в файловую систему
  });
  // const model = await tf.loadLayersModel("file://./model/model.json");

  console.log("*** Success! Model learned!");

  // const recentData = data.slice(-30).map((d) => d.close);
  const recentData = data.map((d) => d.close);

  const predictedValue = predictNextValue(
    model,
    recentData,
    minPrice,
    maxPrice
  );

  console.log(`Predicted next value: ${predictedValue}`);
}

main();

// Пример использования загруженной модели для прогнозирования
// loadModel().then(model => {
//   const recentData = data.slice(-30).map(d => d.close);
//   const normalizedRecentData = recentData.map(price => normalize(price, minPrice, maxPrice));
//   const denormalizedValue = predictNextValue(model, normalizedRecentData, minPrice, maxPrice);
//   console.log(`Denormalized predicted next value: ${denormalizedValue}`);
// });
