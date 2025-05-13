export type UseCaseStatus = "completed" | "pending" | "failed";
export interface UseCaseResult<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
}

export type UseCaseFactory<T, P, D> = (dependencies: D) => (params: P) => Promise<UseCaseResult<T>>;
