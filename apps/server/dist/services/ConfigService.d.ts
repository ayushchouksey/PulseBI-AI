export declare class ConfigService {
    static getPublicConfig(): Promise<{
        maxUploadSize: number;
        maxRows: number;
        maxColumns: number;
        ollamaModel: string;
        supportedFileTypes: string[];
        supportedCharts: string[];
    }>;
}
