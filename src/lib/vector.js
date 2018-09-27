//add two vectors
export const add = (x1, y1, x2, y2) => [x1 + x2, y1 + y2]

//subtract v2  from v1
export const sub = (x1, y1, x2, y2) => [x1 - x2, y1 - y2]

//dot product of two vectors
export const dot = (x1, y1, x2, y2) => x1 * x2 + y1 * y2

//scalar multiplication with a vector
export const mul = (s, x, y) => [s * x, s * y]

//length squared of a vector
export const len2 = (x, y) => x * x + y * y
