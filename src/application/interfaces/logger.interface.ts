export interface Logger {
    debug(message: string, ...meta: any[]): void;
    info(message: string, ...meta: any[]): void;
    warn(message: string, ...meta: any[]): void;
    error(message: string, error?: unknown, ...meta: any[]): void;

    child(options: Record<string, unknown>): Logger;
}
