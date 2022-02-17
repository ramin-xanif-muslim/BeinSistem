import { useCallback, useRef } from "react";

export function useDebounce (callback, delay) {
    const timer = useRef()
    console.log('aaa')

    const debouncedCallback = useCallback((...args) => {
        console.log(args)
        if(timer.current) {
            clearTimeout(timer.current)
        }
        timer.current = setTimeout(() => {
            callback(...args)
        },delay)
    },[callback, delay])

    return debouncedCallback
}