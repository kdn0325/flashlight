import React from "react";
import { AveragedTestCaseResult, POLLING_INTERVAL } from "@perf-profiler/types";
import { Chart } from "../components/Chart";
import { roundToDecimal } from "../../utils/roundToDecimal";

export const FPSReport = ({
  results,
}: {
  results: AveragedTestCaseResult[];
}) => {
  const ram = results.map((result) => ({
    name: result.name,
    data: result.average.measures
      .map((measure) => measure.fps)
      .map((value, i) => ({
        x: i * POLLING_INTERVAL,
        y: roundToDecimal(value, 0),
      })),
  }));

  return (
    <Chart
      title="Frame rate (FPS)"
      height={500}
      interval={POLLING_INTERVAL}
      series={ram}
    />
  );
};
