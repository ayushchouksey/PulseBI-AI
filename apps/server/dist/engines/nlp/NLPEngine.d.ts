import type { Dataset, ColumnMetadata, DatasetStatistics } from "@pulsebi/shared-types";
import type { Engine } from "../../core/engine.interface.js";
export interface NLPInput {
    dataset: Dataset;
    metadata: ColumnMetadata[];
    statistics: DatasetStatistics;
    question: string;
}
export interface NLPResponse {
    intent: string;
    answer: string;
    widget?: string;
}
export declare class NLPEngine implements Engine<NLPInput, NLPResponse> {
    execute(input: NLPInput): NLPResponse;
}
