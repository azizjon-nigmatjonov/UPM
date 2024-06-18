import { sum, mult } from '../utils/counters'
describe('Testing counters', () => {
    test('should return sum of number', () => {
        expect(sum(2)).toBe(4);
    })

    test('should return multiple of number', () => {
        expect(mult(3)).toBe(9);
    })
})

describe('test request', () => {
    test('should return error', () => {
        
    })
})