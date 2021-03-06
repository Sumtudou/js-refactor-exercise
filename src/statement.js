function statement(invoice, plays) {
    return getTxtFormatResult(getData(invoice, plays));
}

function htmlStatement(invoice, plays) {
    return getHtmlFormatResult(getData(invoice, plays));
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
            thisAmount = 30000 + 300 * perf.audience;
            if (perf.audience > 20) {
                thisAmount += 10000 + 500 * (perf.audience - 20);
            }
            break;
        default:
            throw new Error(`unknown type: ${play.type}`);
    }
    return thisAmount;
}

function getData(invoice, plays) {
    let data = {};
    let item = [];
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let line = {
            'thisAmount': calculateAmount(play, perf),
            'seats': perf.audience,
            'playName': play.name
        };
        item.push(line);
    }
    data.allLine = item;
    data.credits = calculateTotalCredits(invoice, plays);
    data.totalAmount = calculateTotalAmount(invoice, plays);
    data.customer = invoice.customer;
    return data;
}

function getTxtFormatResult(data) {
    // let data = getData(invoice, plays);
    let result = `Statement for ${data.customer}\n`;
    for (let dataItem of data.allLine) {
        result += ` ${dataItem.playName}: ${numberFormat(dataItem.thisAmount)} (${dataItem.seats} seats)\n`;
    }
    result += `Amount owed is ${numberFormat(data.totalAmount)}\n`;
    result += `You earned ${data.credits} credits \n`;
    return result;
}

function getHtmlFormatResult(data) {
    let result =
        `<h1>Statement for ${data.customer}</h1>\n` +
        `<table>\n` +
        `<tr><th>play</th><th>seats</th><th>cost</th></tr>`;
    for (let dataItem of data.allLine) {
        result += ` <tr><td>${dataItem.playName}</td><td>${dataItem.seats}</td><td>${numberFormat(dataItem.thisAmount)}</td></tr>\n`
    }
    result += `</table>\n` +
        `<p>Amount owed is <em>${numberFormat(data.totalAmount)}</em></p>\n` +
        `<p>You earned <em>${data.credits}</em> credits</p>\n`
    return result;
}

function numberFormat(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount / 100);
}

module.exports = {
    statement, htmlStatement
};