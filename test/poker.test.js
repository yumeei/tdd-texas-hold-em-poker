import { describe, test, expect } from 'vitest';

const {evaluateHand} = require('../poker');

describe('POKER HAND EVALUATION - Catégories de base', () => {

    describe('High Card', () => {
    test('doit retourner les 5 meilleurs cartes sur 7 en ordre décroissant', () => {
        const board = ['2h', '7d', '4c', '9s', 'Jc'];
        const holeCards = ['Kd', '3h'];

        const result = evaluateHand(board, holeCards);
        
        expect(result).toEqual({
            category: 'High Card',
            chosen5: ['Kd', 'Jc', '9s', '7d', '4c']
        });
    });
    
    test('doit fonctionner même si les meilleurs cartes sont sur le board', () => {
        const board = ['Ah', 'Kh', 'Qh', 'Jh', '9s'];
        const holeCards = ['2d', '3h'];

        const result = evaluateHand(board, holeCards);

        expect(result).toEqual({
            category: 'High Card',
            chosen5: ['Ah', 'Kh', 'Qh', 'Jh', '9s']
        });
    });
    });
});
