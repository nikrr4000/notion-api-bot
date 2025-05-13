export type ServiceDependencies = Record<string, any>;

export type ServiceFactory<T, D extends ServiceDependencies = ServiceDependencies> = (dependencies: D) => T;
