import { Line } from "react-chartjs-2";
import React from "react";
import "../style.css";

export default function StockChart({ stocks }) {
  const state = {
    labels: stocks.map((stock) => stock.timestamp).reverse(),

    datasets: [
      {
        borderColor: "#6da832",
        label: "Highest Price",
        fill: false,
        strokeColor: "#6da832",
        pointRadius: 1,
        data: stocks.map((stock) => stock.high).reverse(),
      },
      {
        borderColor: "#f227ab",
        label: "Lowest Price",
        fill: false,
        strokeColor: "#f227ab",
        pointRadius: 1,
        data: stocks.map((stock) => stock.low).reverse(),
      },
      {
        borderColor: "#27f2d7",
        label: "Open Price",
        fill: false,
        strokeColor: "#27f2d7",
        pointRadius: 1,
        data: stocks.map((stock) => stock.open).reverse(),
      },
      {
        borderColor: "#f26427",
        label: "Close Price",
        fill: false,
        strokeColor: "#f26427",
        pointRadius: 1,
        data: stocks.map((stock) => stock.close).reverse(),
      },
    ],
  };

  return (
    <Line
      data={state}
      height={200}
      options={{
        title: {
          text: "Stock variant chart",
          display: true,
          fontSize: 40,
          fontColor: "#d63031",
        },
        legend: {
          display: true,
          position: "right",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "index",
          intersect: false,
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 100,
            bottom: 100,
          },
        },
      }}
    />
  );
}
