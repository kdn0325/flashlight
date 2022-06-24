import { executeCommand } from "../shell";

export const getRamPageSize = () => {
  try {
    return parseInt(executeCommand(`adb shell getconf PAGESIZE`), 10);
  } catch (error) {
    console.error(error);
    return 4096;
  }
};

const BYTES_PER_MB = 1024 * 1024;
const RAM_PAGE_SIZE = getRamPageSize();

export const getCommand = (pidId: string) => `cat /proc/${pidId}/statm`;

export const processOutput = (result: string) => {
  return (parseInt(result.split(" ")[1], 10) * RAM_PAGE_SIZE) / BYTES_PER_MB;
};