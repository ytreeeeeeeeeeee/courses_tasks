export function errorHandler(target: any, property: string, descriptor: PropertyDescriptor) {
    if (descriptor) {
        const original = descriptor.value;
        descriptor.value = function(...args: any[]) {
            try {
                return original.call(this, ...args);
            } catch (e: any) {
                throw new Error(e.message);
            }
        }
        return descriptor;
    }
}