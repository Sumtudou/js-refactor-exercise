function statement(invoice, plays) {
    return getTxtFormatResult(invoice, plays);
}

function htmlStatement(invoice, plays){
    let data = getData(invoice, plays);
    const format = numberFormat();
    let result =
    `<h1>Statement for ${invoice.customer}</h1>\n` +
    `<table>\n` +
    `<tr><th>play</th><th>seats</th><th>cost</th></tr>` ;
    for(let item in data.allLine){
        let dataItem = data.allLine[item];
        result +=` <tr><td>${dataItem.playName}</td><td>${dataItem.seats}</td><td>${format(dataItem.thisAmount / 100)}</td></tr>\n`
    }
    result += `</table>\n` +
    `<p>Amount owed is <em>${format(data.totalAmount / 100)}</em></p>\n` +
    `<p>You earned <em>${data.credits}</em> credits</p>\n`
    return result;
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

function getData(invoice, plays){
    let data = {};
    let item = [];
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let line = {
            'thisAmount':calculateAmount(play, perf),
            'seats':perf.audience,
            'playName':play.name
        };
        item.push(line);
    }
    data.allLine = item;
    data.credits = calculateTotalCredits(invoice, plays);
    data.totalAmount = calculateTotalAmount(invoice, plays);
    return data;
}

function getTxtFormatResult(invoice, plays) {
    let data = getData(invoice, plays);
    const format = numberFormat();
    let result = `Statement for ${invoice.customer}\n`;
    for(let item in data.allLine){
        let dataItem = data.allLine[item];
        result += ` ${dataItem.playName}: ${format(dataItem.thisAmount / 100)} (${dataItem.seats} seats)\n`;
    }
    result += `Amount owed is ${format(data.totalAmount / 100)}\n`;
    result += `You earned ${data.credits} credits \n`;
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
    statement,htmlStatement
};