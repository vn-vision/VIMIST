import { useState, useEffect } from "react";

const useDebounce = (value: string | number, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState<string | number>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup on value change or delay change
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;  // Return the debounced value
};

export default useDebounce;
