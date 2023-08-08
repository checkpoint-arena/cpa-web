import { useEffect, useState } from "react"
import { TransitionOptions, UseQueryStateOptions, UseQueryStateReturn, useQueryState } from "next-usequerystate"

// Workaround for https://github.com/47ng/next-usequerystate/issues/290
// This breaks SSR, but we generate a static site anyway.
export function useIsFirstRender() {
    const [isFirstRender, setIsFirstRender] = useState(true)
    useEffect(() => {
        setIsFirstRender(false)
    }, [])
    return isFirstRender
}

// Like useQueryState, but does not scroll to top of page upon setting a value
export function useQueryStateNoScroll<T>(key: string, options: UseQueryStateOptions<T> & {
    defaultValue: T;
}): UseQueryStateReturn<NonNullable<ReturnType<typeof options.parse>>, typeof options.defaultValue> {
    const [value, setter] = useQueryState<T>(key, options)
    type Parsed = NonNullable<ReturnType<typeof options.parse>>
    type Default = typeof options.defaultValue
    const wrapper = (value: null | Parsed | ((old: Default extends Parsed ? Parsed : Parsed | null) => Parsed | null), transitionOptions?: TransitionOptions) =>
        setter(value, { scroll: false, ...transitionOptions })
    return [value, wrapper]
}