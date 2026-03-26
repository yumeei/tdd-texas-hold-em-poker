import { describe, test, expect } from 'vitest';
import {evaluateHand, comparePlayers} from './poker.js';

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
            const holeCards = ['2d', '3c'];

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


    describe('Straight, Flush', () => {
        test('doit détecter une suite classique', () => {
            const board = ['Th', 'Jd', 'Kc', '2s', 'Qh'];
            const holeCards = ['Ah', '3d'];
            expect(evaluateHand(board, holeCards)).toEqual({
                category: 'Straight',
                chosen5: ['Ah', 'Kc', 'Qh', 'Jd', 'Th']
            });
        });
        test('doit détecter une suite avec l\'As comme carte basse', () => {
            const board = ['Ah', '2d', '3c', '4s', '9c'];
            const holeCards = ['5h', 'Kd'];
            expect(evaluateHand(board, holeCards)).toEqual({
                category: 'Straight',
                chosen5: ['5h', '4s', '3c', '2d', 'Ah']
            });
        }); 
        test('doit détecter une couleur (Flush) avec plus de 5 cartes', () => {
            const board = ['Ah', 'Jh', '9h', '4h', '2h'];
            const holeCards = ['6h', 'Kh'];
            expect(evaluateHand(board, holeCards)).toEqual({
                category: 'Flush',
                chosen5: ['Ah', 'Kh', 'Jh', '9h', '6h']
            });
        }); 

    });


    describe('Combinaisons Supérieures (Full house, Carré, Quinte Flush)', () => {
        test('doit détecter un Full house et choisir le meilleur brelan et la meilleure paire', () => {
            const board = ['Kh', 'Kd', '4c', '4s', '9c'];
            const holeCards = ['Ks', 'Jd'];

            const result = evaluateHand(board, holeCards);
            expect(evaluateHand(board, holeCards)).toEqual({
                category: 'Full house',
                chosen5: ['Kh', 'Kd', 'Ks', '4c', '4s']
            });
        });
        
        test('doit détecter un carré et choisir le kicker le plus élevé', () => {
            const board = ['7h', '7d', '7c', '4s', '2c'];
            const holeCards = ['7s', 'Ah'];
            const result = evaluateHand(board, holeCards);
            expect(result).toEqual({
                category: 'Four of a kind',
                chosen5: ['7h', '7d', '7c', '7s', 'Ah']
            });
        });

        test('doit détecter une quinte flush et choisir les 5 cartes de la même couleur en ordre décroissant', () => {
            const board = ['8h', '9h', 'Th', 'Jh', '2c'];
            const holeCards = ['Qh', 'Ah'];
            const result = evaluateHand(board, holeCards);
            expect(result).toEqual({
                category: 'Straight flush',
                chosen5: ['Qh', 'Jh', 'Th', '9h', '8h']
            });
        });
    }); 
});


describe('COMPARAISON DES JOUEURS - Tie-breaks et Gagnants', () => {
        test('doit faire gagner le joueur avec la meilleure catégorie', () => {
            const board = ['2h', '7d', '4c', '9s', 'Jc'];
            const player1 = ['Jd', '3h'];
            const player2 = ['9h', '9d'];
            
            const result = comparePlayers(board, [player1, player2]);
            expect(result.winners).toEqual([1]);
        });

        test('doit départager deux joueurs avec le même Carré grâce au kicker', () => {
            const board = ['7h', '7d', '7c', '4s', '2c'];
            const player1 = ['Ah', 'Kh'];
            const player2 = ['Qd', 'Jc'];
            
            const result = comparePlayers(board, [player1, player2]);
            expect(result.winners).toEqual([0]);
        });

        test('doit gérer une égalité parfaite (split pot) quand le board est la meilleure main', () => {
            const board = ['5h', '6d', '7c', '8s', '9c'];
            const player1 = ['Ah', 'Ac'];
            const player2 = ['Kd', 'Qc'];
            
            const result = comparePlayers(board, [player1, player2]);
            expect(result.winners).toEqual([0, 1]);
        });
    });

    describe('Cas limites et robustesse', () => {
        
        test('doit choisir les deux meilleures paires quand un joueur en a trois', () => {
            const board = ['Ah', 'As', 'Kh', 'Ks', '9c'];
            const holeCards = ['Qh', 'Qs'];
            const result = evaluateHand(board, holeCards);
            expect(result.category).toBe('Two Pair');
            expect(result.chosen5).toEqual(['Ah', 'As', 'Kh', 'Ks', 'Qh']); 
        });

        test('doit former le meilleur Full House possible avec deux brelans', () => {
            const board = ['Th', 'Td', 'Ts', '2h', '2d'];
            const holeCards = ['2s', '9c'];
            const result = evaluateHand(board, holeCards);
            expect(result.category).toBe('Full house');
            expect(result.chosen5).toEqual(['Th', 'Td', 'Ts', '2h', '2d']);
        });

        test('ne doit pas détecter de suite circulaire (Q-K-A-2-3)', () => {
            const board = ['Qh', 'Ks', 'Ah', '2d', '3c'];
            const holeCards = ['7s', '8c'];
            const result = evaluateHand(board, holeCards);
            expect(result.category).not.toBe('Straight');
        });
    });