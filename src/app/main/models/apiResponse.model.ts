export interface ApiResponse<T> {
    message: string;
    failed: boolean;
    result: T
}