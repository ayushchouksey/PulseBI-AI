import { Buffer } from "node:buffer";
export declare class DelimiterDetector {
    private readonly delimiters;
    detect(buffer: Buffer): string;
}
