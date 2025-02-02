export const trimValues = (object: Record<string, any>): Record<string, any> => {
    return Object.keys(object).reduce((acc, key) => {
        const value = object[key];

        if (typeof value === 'string') {
            acc[key] = value.trim();
        } else if (Array.isArray(value)) {
            acc[key] = value.map(item => (typeof item === 'string' ? item.trim() : item));
        } else if (typeof value === 'object' && value !== null) {
            acc[key] = trimValues(value);
        } else {
            acc[key] = value;
        }

        return acc;
    }, {} as Record<string, any>);
};
