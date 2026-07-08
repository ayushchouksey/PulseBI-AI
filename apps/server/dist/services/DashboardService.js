import { v4 as uuidv4 } from 'uuid';
import { DashboardEngine } from '../engines/dashboard/DashboardEngine.js';
export class DashboardService {
    engine = new DashboardEngine();
    async generateInitialDashboard(datasetId = uuidv4(), _metadata) {
        const dashboardId = uuidv4();
        await this.engine.generate({}, {});
        return {
            dashboardId,
            datasetId,
            title: 'Sales Overview Dashboard',
            description: 'Auto Generated Business Intelligence Dashboard',
            createdAt: new Date().toISOString(),
            widgets: [
                {
                    id: uuidv4(),
                    title: 'Total Revenue',
                    type: 'kpi',
                    position: { x: 0, y: 0, w: 3, h: 2 },
                    chartType: 'line',
                    dataSource: 'statistics',
                    configuration: {
                        value: 542000,
                        format: 'currency',
                        change: '+18.5%',
                        trend: 'up',
                    },
                    exportable: true,
                    visible: true,
                },
                {
                    id: uuidv4(),
                    title: 'Monthly Revenue Trend',
                    type: 'chart',
                    chartType: 'line',
                    position: { x: 0, y: 2, w: 12, h: 4 },
                    dataSource: 'trend',
                    configuration: {
                        xAxis: 'OrderDate',
                        yAxis: 'Revenue',
                    },
                    exportable: true,
                    visible: true,
                },
            ],
            filters: [
                {
                    id: uuidv4(),
                    field: 'Category',
                    type: 'dropdown',
                    values: ['Electronics', 'Furniture', 'Clothing'],
                    selected: [],
                },
            ],
            layout: {},
            theme: 'default',
        };
    }
    async generateDashboard(_datasetId) {
        return this.generateInitialDashboard(_datasetId);
    }
    async updateDashboard(dashboardId, updateData) {
        return {
            dashboardId,
            title: updateData.title || 'Updated Dashboard',
            description: 'Auto Generated Business Intelligence Dashboard',
            createdAt: new Date().toISOString(),
            widgets: updateData.widgets || [],
            filters: updateData.filters || [],
            layout: updateData.layout || {},
            theme: updateData.theme || 'default',
        };
    }
}
//# sourceMappingURL=DashboardService.js.map