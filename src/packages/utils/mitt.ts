/**
 * 事件监听
 * */

export type EventType = string | symbol;

// 事件类型
export type Handler<T = unknown> = (event: T) => void;
export type WildcardHandler<T = Record<string, unknown>> = (
    type: keyof T,
    event: T[keyof T],
) => void;

// 事件值是一个数组类型
export type EventHandlerList<T = unknown> = Array<Handler<T>>;
//
export type WildCardEventHandlerList<T = Record<string, unknown>> = Array<WildcardHandler<T>>;

// 定义事件存储容器Map类型
export type EventHandlerMap<T extends Record<EventType, unknown>> = Map<
    keyof T | '*',
    EventHandlerList<T[keyof T]> | WildCardEventHandlerList<T>
>;
// '*'：添加通配符事件处理器，只要监听了通配符事件，其他事件触发，通配符事件也会触发
export interface Emitter<T extends Record<EventType, unknown>> {
    all: EventHandlerMap<T>;
    on<K extends keyof T>(key: K, handler: Handler<T[K]>): void;
    on(key: '*', handler: WildcardHandler<T>): void;
    off<K extends keyof T>(key: K, handler?: Handler<T[K]>): void;
    off(key: '*', handler: WildcardHandler<T>): void;
    emit<K extends keyof T>(key: K, event: T[K]): void;
    emit<K extends keyof T>(key: undefined extends T[K] ? K : never): void;
    clear(): void;
}

/**
 * Mitt: Tiny (~200b) functional event emitter / pubsub.
 * @name mitt
 * @returns {Mitt}
 */
export function mitt<T extends Record<EventType, unknown>> (all?: EventHandlerMap<T>): Emitter<T> {
    // 泛型T实际上是一个对象，对象中的key对应的就是on和emit执行的key，对象中的值就是执行事件传参
    // T[keyof T] 实际上是监听回调函数接收的参数
    type GenericEventHandler = Handler<T[keyof T]> | WildcardHandler<T>;
    all = all || new Map()
    return {
      all,
      // 设置监听
      on<K extends keyof T> (key: K, handler: GenericEventHandler) {
        const handlers: Array<GenericEventHandler> | undefined = all!.get(key)
        // 因为可能监听多个相同的事件名称，所以key对应的事件值以一个数组容器存储
        if (handlers) {
          // 数组
          handlers.push(handler)
        } else {
          // 数组
          all!.set(key, [handler] as EventHandlerList<T[keyof T]>)
        }
      },
      // 触发监听
      emit<K extends keyof T> (key: K, evt?: T[K]) {
        let handlers = all!.get(key)
        // 拿到的事件值本身就是存在数组中的
        if (handlers) {
          (handlers as EventHandlerList<T[keyof T]>).slice().forEach((handler) => {
            // 执行key对应的事件
            handler(evt as T[K])
          })
        }
        // 通配符事件
        // 看是否有监听*的事件，这儿handlers重新赋值不会影响上面的handlers执行
        handlers = all!.get('*')
        if (handlers) {
          (handlers as WildCardEventHandlerList<T>).slice().forEach((handler) => {
            // 当触发某个事件的时候，会执行通配符事件，并且将当前事件名称和参数传递，在on监听通配符事件那就可以知道是哪个事件和拿到参数
            handler(key, evt as T[K])
          })
        }
      },
      // 取消某个事件的监听
      off<K extends keyof T> (key: K, handler?: GenericEventHandler) {
        const handlers: Array<GenericEventHandler> | undefined = all!.get(key)
        if (handlers) {
          if (handler) {
            handlers.splice(handlers.indexOf(handler) >>> 0, 1)
          } else {
            all!.set(key, [])
          }
        }
      },
      // 清除所有事件监听
      clear () {
        this.all.clear()
      }
    }
}
