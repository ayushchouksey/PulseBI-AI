import type {
    DashboardLayout,
    DashboardWidget,
  } from "./types.js";
  
  export class LayoutBuilder {
  
    execute(
      widgets: DashboardWidget[]
    ): DashboardLayout {
  
      let y = 0;
  
      widgets.forEach((widget, index) => {
  
        if (widget.type === "kpi") {
  
          widget.position = {
            x: index * 3,
            y: 0,
            w: 3,
            h: 2,
          };
  
        } else {
  
          widget.position = {
            x: 0,
            y: y + 2,
            w: 12,
            h: 5,
          };
  
          y += 5;
  
        }
  
      });
  
      return {
  
        columns: 12,
  
        rowHeight: 100,
  
      };
  
    }
  
  }