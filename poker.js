const RANK_VALUES = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

const CATEGORY_RANKS = {
    'High Card': 1,
    'One Pair': 2,
    'Two Pair': 3,
    'Three of a Kind': 4,
    'Straight': 5,
    'Flush': 6,
    'Full house': 7,
    'Four of a kind': 8,
    'Straight flush': 9
};

function sortCardsDescending(cards) {
    return cards.sort((a, b) => RANK_VALUES[b[0]] - RANK_VALUES[a[0]]);
}

function getStraightCards(sortedCards) {
    const uniqueCards = [];
    const seen = new Set();
    for (const card of sortedCards) {
        if (!seen.has(card[0])) {
            seen.add(card[0]);
            uniqueCards.push(card);
        }
    }

    for (let i = 0; i <= uniqueCards.length - 5; i++) {
        const highRank = RANK_VALUES[uniqueCards[i][0]];
        const lowRank = RANK_VALUES[uniqueCards[i + 4][0]];
        if (highRank - lowRank === 4) {
            return uniqueCards.slice(i, i + 5);
        }
    }

    if (uniqueCards.length >= 5 && uniqueCards[0][0] === 'A') {
        const wheelRanks = ['5', '4', '3', '2'];
        const hasWheel = wheelRanks.every(rank => uniqueCards.some(card => card[0] === rank));
        
        if (hasWheel) {
            const straightCards = wheelRanks.map(rank => uniqueCards.find(card => card[0] === rank));
            straightCards.push(uniqueCards[0]);
            return straightCards;
        }
    }
    
    return null;
}

function evaluateHand(board, holeCards) {
    const allCards = [...board, ...holeCards];
    const sortedCards = sortCardsDescending([...allCards]);

    const suitGroups = {};
    for (const card of sortedCards) {
        const suit = card[1];
        if (!suitGroups[suit]) suitGroups[suit] = [];
        suitGroups[suit].push(card);
    }

    const rankGroups = {};
    for (const card of sortedCards) {
        const rank = card[0];
        if (!rankGroups[rank]) {
            rankGroups[rank] = [];
        }
        rankGroups[rank].push(card);
    }

    const groups = Object.values(rankGroups).sort((a, b) => {
        if (a.length !== b.length) return b.length - a.length;
        return RANK_VALUES[b[0][0]] - RANK_VALUES[a[0][0]];
    });

    for (const suit in suitGroups) {
        if (suitGroups[suit].length >= 5) {
            const straightFlushCards = getStraightCards(suitGroups[suit]);
            if (straightFlushCards) {
                return { category: 'Straight flush', chosen5: straightFlushCards };
            }
        }
    }

    if (groups[0].length === 4) {
        const quads = groups[0];
        const kicker = groups.slice(1).flat().slice(0, 1);
        return { category: 'Four of a kind', chosen5: [...quads, ...kicker] };
    }

    if (groups[0].length === 3 && groups.length > 1 && groups[1].length >= 2) {
        const trips = groups[0];
        const pair = groups[1].slice(0, 2);
        return { category: 'Full house', chosen5: [...trips, ...pair] };
    }

    for (const suit in suitGroups) {
        if (suitGroups[suit].length >= 5) {
            return { category: 'Flush', chosen5: suitGroups[suit].slice(0, 5) };
        }
    }

    const straightCards = getStraightCards(sortedCards);
    if (straightCards) {
        return { category: 'Straight', chosen5: straightCards };
    }

    if (groups[0].length === 3) {
        const trips = groups[0];
        const kickers = groups.slice(1).flat().slice(0, 2);
        return { category: 'Three of a Kind', chosen5: [...trips, ...kickers] };
    }

    if (groups[0].length === 2) {
        if (groups.length > 1 && groups[1].length === 2) {
            const highPair = groups[0];
            const lowPair = groups[1];
            const kicker = groups.slice(2).flat().slice(0, 1);
            return { category: 'Two Pair', chosen5: [...highPair, ...lowPair, ...kicker] };
        }
        
        const pair = groups[0];
        const kickers = groups.slice(1).flat().slice(0, 3);
        return { category: 'One Pair', chosen5: [...pair, ...kickers] };
    }

    return { category: 'High Card', chosen5: sortedCards.slice(0, 5) };
}

function comparePlayers(board, playersHoleCards) {
    const evaluatedHands = playersHoleCards.map(holeCards => evaluateHand(board, holeCards));
    
    let winners = [];
    let bestHand = null;

    for (let i = 0; i < evaluatedHands.length; i++) {
        const currentHand = evaluatedHands[i];
        
        if (!bestHand) {
            winners = [i];
            bestHand = currentHand;
            continue;
        }

        const currentCategoryRank = CATEGORY_RANKS[currentHand.category];
        const bestCategoryRank = CATEGORY_RANKS[bestHand.category];

        if (currentCategoryRank > bestCategoryRank) {
            winners = [i];
            bestHand = currentHand;
        } else if (currentCategoryRank === bestCategoryRank) {
            let isTie = true;
            let isBetter = false;

            for (let j = 0; j < 5; j++) {
                const currentCardRank = RANK_VALUES[currentHand.chosen5[j][0]];
                const bestCardRank = RANK_VALUES[bestHand.chosen5[j][0]];

                if (currentCardRank > bestCardRank) {
                    isBetter = true;
                    isTie = false;
                    break;
                } else if (currentCardRank < bestCardRank) {
                    isTie = false;
                    break;
                }
            }

            if (isBetter) {
                winners = [i];
                bestHand = currentHand;
            } else if (isTie) {
                winners.push(i);
            }
        }
    }

    return {
        winners: winners,
        hands: evaluatedHands
    };
}

export { evaluateHand, comparePlayers };