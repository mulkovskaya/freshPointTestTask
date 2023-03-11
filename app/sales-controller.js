const simpleSalesForecasting = require("simple-sales-forecasting");
const decodeISO = require("isodate-convert").decode;
const encodeISO = require("isodate-convert").encode;

const DEFAULTS = {
  PREDICTION_NUM: 2,
  CYCLE: 16,
};

function getNextWeek(lastWeek) {
  let last = decodeISO({ date: lastWeek });
  let next = new Date(
    last.date.getFullYear(),
    last.date.getMonth(),
    last.date.getDate() + 7,
    last.date.getHours()
  );
  let nextWeek = encodeISO(next);
  return nextWeek;
}

function predictSales(reqData) {
  let resData = {};

  let data = reqData?.data;
  if (!data) {
    throw new Error("data is required");
  }

  let numberOfPredictions = DEFAULTS.PREDICTION_NUM; //default value
  let cycle = DEFAULTS.CYCLE; //default value

  let params = reqData.params;

  let weeksNumber = params?.find((elem) => elem.name === "weeks_number");
  if (weeksNumber?.value > 0) {
    numberOfPredictions = weeksNumber.value;
  }

  let salesCycle = params?.find((elem) => elem.name === "sales_cycle");
  if (salesCycle?.value > 2) {
    cycle = salesCycle.value;
  }

  let sales;
  sales = data?.map((elem) => {
    return elem.value;
  });

  let predictedValues = simpleSalesForecasting(
    sales,
    numberOfPredictions,
    cycle
  );

  let resSales = data;

  for (let i = 0; i < predictedValues.predictions.length; i++) {
    let predictedWeek = {};
    lastIndex = resSales.length - 1;
    let lastWeek = resSales[lastIndex].timestamp;
    let prediction = predictedValues.predictions[i];
    predictedWeek.timestamp = getNextWeek(lastWeek);
    predictedWeek.value = Math.floor(prediction);
    resSales.push(predictedWeek);
  }

  resData = {
    data: resSales,
  };

  return resData;
}

module.exports = {
  predictSales,
};
