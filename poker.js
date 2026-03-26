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
    
    const sortedCards = sortCardsDescending(allCards);
    
    const chosen5 = sortedCards.slice(0, 5);
    
    return {
        category: 'High Card',
        chosen5: chosen5
    };
}

module.exports = { evaluateHand };
