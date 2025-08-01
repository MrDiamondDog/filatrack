export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/**
 * Union type where keys of T and U are mutually exclusive
*/
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
