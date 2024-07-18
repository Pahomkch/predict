import { OHLC } from "@/types";
import * as tf from "@tensorflow/tfjs-node";

// #region нормализация
export const prepareData = (data: OHLC[]) => {
  const prices = data.map((d) => d.close); // Извлечение цен закрытия
  const windowSize = 30; // Размер окна для временного ряда
  const inputs = [];
  const outputs = [];

  for (let i = windowSize; i < prices.length; i++) {
    const input = prices.slice(i - windowSize, i);
    const output = prices[i];
    inputs.push(input);
    outputs.push(output);
  }

  return {
    inputs: tf.tensor3d(
      inputs.map((d) => d.map((v) => [v])),
      [inputs.length, windowSize, 1]
    ),
    outputs: tf.tensor2d(outputs, [outputs.length, 1]),
  };
};
// #endregion

// #region Создание модели
export const createModel = (inputShape: number) => {
  const model = tf.sequential();
  model.add(
    tf.layers.lstm({
      units: 50,
      returnSequences: true,
      inputShape: [inputShape, 1],
    })
  );
  model.add(tf.layers.lstm({ units: 50, returnSequences: false }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({
    optimizer: "adam",
    loss: "meanSquaredError",
  });

  return model;
};
// #endregion

// #region Обучение модели
export const trainModel = async (
  model: tf.Sequential,
  inputs: tf.Tensor3D,
  outputs: tf.Tensor2D
) => {
  await model.fit(inputs, outputs, {
    epochs: 100,
    batchSize: 32,
    validationSplit: 0.2,
    callbacks: [tf.callbacks.earlyStopping({ patience: 10 })], // Использование только встроенного колбэка

    verbose: 0, // Отключение прогресс-бара
  });
};
// #endregion

// #region  предсказания

export const predictNextValue = (model: tf.Sequential, input: number[]) => {
  // const inputTensor = tf.tensor2d([input], [1, input.length, 1]);
  const inputTensor = tf.tensor3d(
    [input.map((value) => [value])],
    [1, input.length, 1]
  );
  const prediction = model.predict(inputTensor) as tf.Tensor;
  return prediction.dataSync()[0];
};
// #endregion
