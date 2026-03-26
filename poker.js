const RANK_VALUES = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

function sortCardsDescending(cards) {
    return cards.sort((a, b) => {
        const rankA = a[0];
        const rankB = b[0];
        return RANK_VALUES[rankB] - RANK_VALUES[rankA];
    });
}

function evaluateHand(board, holeCards) {
    const allCards = [...board, ...holeCards];
    const sortedCards = sortCardsDescending([...allCards]);

    const rankGroups = {};
    for (const card of sortedCards) {
        const rank = card[0];
        if (!rankGroups[rank]) {
            rankGroups[rank] = [];
        }
        rankGroups[rank].push(card);
    }

    const groups = Object.values(rankGroups).sort((a, b) => {
        if (a.length !== b.length) {
            return b.length - a.length;
        }
        return RANK_VALUES[b[0][0]] - RANK_VALUES[a[0][0]];
    });

    if (groups[0].length === 3) {
        const trips = groups[0];
        const kickers = groups.slice(1).flat().slice(0, 2);
        return {
            category: 'Three of a Kind',
            chosen5: [...trips, ...kickers]
        };
    }

    if (groups[0].length === 2) {
        if (groups.length > 1 && groups[1].length === 2) {
            const highPair = groups[0];
            const lowPair = groups[1];
            const kicker = groups.slice(2).flat().slice(0, 1);
            return {
                category: 'Two Pair',
                chosen5: [...highPair, ...lowPair, ...kicker]
            };
        }
        
        const pair = groups[0];
        const kickers = groups.slice(1).flat().slice(0, 3);
        return {
            category: 'One Pair',
            chosen5: [...pair, ...kickers]
        };
    }

    return {
        category: 'High Card',
        chosen5: sortedCards.slice(0, 5)
    };
}

module.exports = { evaluateHand };