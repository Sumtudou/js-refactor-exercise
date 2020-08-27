function statement(invoice, plays) {
    let volumeCredits = calculateTotalCredits(invoice, plays);
    let totalAmount = calculateTotalAmount(invoice, plays);
    return getTxtFormatResult(invoice, plays, totalAmount, volumeCredits);
}

function calculateTotalCredits(invoice, plays) {
    let volumeCredits = 0;
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        volumeCredits = calThisCredits(volumeCredits, perf.audience, play.type);
    }
    return volumeCredits;
}

function calculateTotalAmount(invoice, plays) {
    let totalAmount = 0;
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = calculateAmount(play, perf);
        totalAmount += thisAmount;
    }
    return totalAmount;
}


function calThisCredits(volumeCredits, audience, playType) {
    volumeCredits += Math.max(audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ('comedy' === playType)
        volumeCredits += Math.floor(audience / 5);
    return volumeCredits;
}

function calculateAmount(play, perf) {
    let thisAmount = 0;
    switch (play.type) {
        case 'tragedy':
            thisAmount = 40000;
            if (perf.audience > 30) {
                thisAmount += 1000 * (perf.audience - 30);
            }
            break;
        case 'comedy':
            thisAmount = 30000;
            if (perf.audience > 20) {
                thisAmount += 10000 + 500 * (perf.audience - 20);
            }
            thisAmount += 300 * perf.audience;
            break;
        default:
            throw new Error(`unknown type: ${play.type}`);
    }
    return thisAmount;
}



function getTxtFormatResult(invoice, plays, totalAmount, volumeCredits) {
    let result = `Statement for ${invoice.customer}\n`;
    const format = numberFormat();

    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = calculateAmount(play, perf);
        result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits \n`;
    return result;
}

function numberFormat() {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format;
}

module.exports = {
    statement,
};