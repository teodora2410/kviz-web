import type { ResultDto } from "../models/models";

export interface IResultService {
  recordResult(result: ResultDto): Promise<boolean>;
  getAllResults(): Promise<ResultDto[]>;
}