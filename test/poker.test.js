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

    describe('One pair, two pair, three of a kind', () => {
    test('doit détecter une paire et trier les  3 kickers', () => {
        const board = ['2h', '7d', '4c', '9s', 'Jc'];
        const holeCards = ['Jd', '3h'];
        expect(evaluateHand(board, holeCards)).toEqual({
            category: 'One Pair',
            chosen5: ['Jc', 'Jd', '9s', '7d', '4c'] 
        });
    });

    test ('doit détecter deux paires et trier le kicker', () => {
        const board = ['2h', '7d', '4c', '9s', 'Jc'];
        const holeCards = ['Jd', '7h'];
        expect(evaluateHand(board, holeCards)).toEqual({
            category: 'Two Pair',
            chosen5: ['Jc', 'Jd', '7d', '7h', '9s']
        });
    });

    test('doit détecter un brelan et trier les 2 kickers', () => {
        const board = ['2h', '7d', '4c', '9s', 'Jc'];
        const holeCards = ['Jd', 'Jh'];
        expect(evaluateHand(board, holeCards)).toEqual({
            category: 'Three of a Kind',
            chosen5: ['Jc', 'Jd', 'Jh', '9s', '7d']
        });
    });
});
});

