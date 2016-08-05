export interface Check {
	execute(directory: string, callback: (report: string) => void): void;
}