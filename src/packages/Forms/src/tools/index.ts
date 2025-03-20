/**
 * 依次从插槽、attrs、props、state 中获取值
 * @param key
 * @param props
 * @param state
 */
import { computed, type ComputedRef, type Ref, unref } from 'vue'
import { getFirstNonNullOrUndefined } from '@/utils/tools'

export function usePriorityValue<
    T extends Record<string, any>,
    S extends Record<string, any>,
    K extends keyof T = keyof T,
> (key: K, props: T, state: Readonly<Ref<S>> | undefined) {
  return computed((): T[K] => {
    console.log('汇编吗')
    return getFirstNonNullOrUndefined(
      props[key],
      state?.value?.[key as keyof S]
    ) as T[K]
  })
}

/**
 * 批量获取state中的值（集中在一个computed，用于透传）
 * @param props
 * @param state
 */
export function useForwardPriorityValues<
    T extends Record<string, any>,
    S extends Ref<Record<string, any>> = Readonly<Ref<NoInfer<T>, NoInfer<T>>>,
> (props: T, state: S | undefined) {
  const computedResult: { [K in keyof T]: ComputedRef<T[K]> } = {} as never;
  (Object.keys(props) as (keyof T)[]).forEach((key) => {
    computedResult[key] = usePriorityValue(
            key as keyof typeof props,
            props,
            state
    )
  })
  return computed(() => {
    const unwrapResult: Record<string, any> = {}
    Object.keys(props).forEach((key) => {
      unwrapResult[key] = unref(computedResult[key])
    })
    return unwrapResult as { [K in keyof T]: T[K] }
  })
}