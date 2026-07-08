import type {
  ColumnMetadata,
  Dataset,
} from "@pulsebi/shared-types";

import type {
  Engine,
} from "../../core/engine.interface.js";

import { BusinessRoleDetector } from "./BusinessRoleDetector.js";
import { ColumnTypeDetector } from "./ColumnTypeDetector.js";
import { DisplayNameGenerator } from "./DisplayNameGenerator.js";
import { AggregationDetector } from "./AggregationDetector.js";

export class MetadataEngine
  implements Engine<Dataset, ColumnMetadata[]> {
  private readonly typeDetector =
    new ColumnTypeDetector();

  private readonly roleDetector =
    new BusinessRoleDetector();

  private readonly displayGenerator =
    new DisplayNameGenerator();

  private readonly aggregationDetector =
    new AggregationDetector();
  execute(
    dataset: Dataset
  ): ColumnMetadata[] {

    return dataset.headers.map(header => {

      const values = dataset.rows.map(
        row => row[header]
      );

      const detectedType =
        this.typeDetector.execute(values);

      const businessRole =
        this.roleDetector.execute(
          header,
          detectedType
        );

      return {

        originalName: header,

        displayName:
          this.displayGenerator.execute(header),

        detectedType,

        businessRole,

        aggregation:
          this.aggregationDetector.execute(
            header,
            detectedType,
            businessRole
          ),

        visible: true,

        confidence: 95,

        sampleValues: values
          .filter(
            value =>
              value !== null &&
              value !== undefined &&
              value !== ""
          )
          .slice(0, 5)
          .map(String),

      };
    });

  }
}