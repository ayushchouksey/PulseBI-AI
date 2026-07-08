import type { Calculator } from "../../core/calculator.interface.js";
import type { StatisticsContext } from "./types.js";
export declare class KPICalculator implements Calculator<StatisticsContext> {
    execute(context: StatisticsContext): StatisticsContext;
}
