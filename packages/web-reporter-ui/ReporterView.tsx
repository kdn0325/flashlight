import React from "react";
import {
  AveragedTestCaseResult,
  Measure,
  POLLING_INTERVAL,
  TestCaseResult,
} from "@perf-profiler/types";
import { CPUReport } from "./src/sections/CPUReport";
import { ReportSummary } from "./src/sections/ReportSummary/ReportSummary.component";
import { RAMReport } from "./src/sections/RAMReport";
import { averageTestCaseResult } from "@perf-profiler/reporter";
import styled from "@emotion/styled";
import { FPSReport } from "./src/sections/FPSReport";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "./src/components/Header";
import { exportRawDataToZIP } from "./utils/reportRawDataExport";
import {
  IterationSelector,
  useIterationSelector,
} from "./src/components/IterationSelector";
import { VideoSection } from "./src/sections/VideoSection";
import { VideoEnabledContext } from "./videoCurrentTimeContext";

const Padding = styled.div`
  height: 10px;
`;

const theme = createTheme({
  typography: {
    fontFamily: [
      "open-sans",
      "Roboto",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
    fontWeightBold: 600,
  },
});

const Report = ({ results }: { results: TestCaseResult[] }) => {
  const minIterationCount = Math.min(
    ...results.map((result) => result.iterations.length)
  );
  const iterationSelector = useIterationSelector(minIterationCount);
  const iterationResults = results.map((result) => ({
    ...result,
    iterations: iterationSelector.showAverage
      ? result.iterations
      : [result.iterations[iterationSelector.iterationIndex]],
  }));

  const averagedResults: AveragedTestCaseResult[] = iterationResults.map(
    averageTestCaseResult
  );

  const saveResultsToZIP = () => {
    exportRawDataToZIP(iterationResults);
  };

  const hasVideos = !!iterationResults.some(
    (iteration) => iteration.iterations[0].videoInfos
  );

  return (
    <>
      <VideoEnabledContext.Provider value={hasVideos}>
        <div className="flex flex-row w-full h-[calc(100%-50px)] overflow-y-hidden">
          <div className="overflow-auto w-full">
            <Header saveToZIPCallBack={saveResultsToZIP} />
            <Padding />
            <ReportSummary
              results={results}
              averagedResults={averagedResults}
            />
            <div className="h-16" />

            <div className="mx-8 p-6 bg-dark-charcoal border border-gray-800 rounded-lg">
              <FPSReport results={averagedResults} />
            </div>
            <div className="h-10" />

            <div className="mx-8 p-6 bg-dark-charcoal border border-gray-800 rounded-lg">
              <CPUReport results={averagedResults} />
            </div>
            <div className="h-10" />

            <div className="mx-8 p-6 bg-dark-charcoal border border-gray-800 rounded-lg">
              <RAMReport results={averagedResults} />
            </div>
            <div className="h-10" />
          </div>

          {hasVideos ? <VideoSection results={iterationResults} /> : null}
        </div>
      </VideoEnabledContext.Provider>

      <IterationSelector
        {...iterationSelector}
        iterationCount={minIterationCount}
      />
    </>
  );
};

export const IterationsReporterView = ({
  results,
}: {
  results: TestCaseResult[];
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Report results={results} />
    </ThemeProvider>
  );
};

export const ReporterView = ({ measures }: { measures: Measure[] }) => (
  <>
    {measures.length > 1 ? (
      <IterationsReporterView
        results={[
          {
            name: "Results",
            iterations: [
              {
                measures,
                time: measures.length * POLLING_INTERVAL,
              },
            ],
          },
        ]}
      />
    ) : null}
  </>
);
