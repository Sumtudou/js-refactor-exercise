const test = require('ava');
const {statement} = require('../src/statement');

test('BigCo number all over 30', t => {
    //given
    const invoice = {
        'customer': 'BigCo',
        'performances': [
            {
                'playID': 'hamlet',
                'audience': 55,
            },
            {
                'playID': 'as-like',
                'audience': 35,
            },
            {
                'playID': 'othello',
                'audience': 40,
            },
        ],
    };
    //when
    const result = statement(invoice, plays);

    let expected = "Statement for BigCo\n" +
        " Hamlet: $650.00 (55 seats)\n" +
        " As You Like It: $580.00 (35 seats)\n" +
        " Othello: $500.00 (40 seats)\n" +
        "Amount owed is $1,730.00\n" +
        "You earned 47 credits \n";
    //then
    t.is(result, expected);
});

test('BigCo no performances', t => {
    //given
    const invoice = {
        'customer': 'BigCo',
        'performances': []
    };
    //when
    const result = statement(invoice, plays);
    console.log(result);

    let expected = "Statement for BigCo\n" +
        "Amount owed is $0.00\n" +
        "You earned 0 credits \n";
    //then
    t.is(result, expected);
});

test('BigCo number all less than 30 or 20', t => {
    //given
    const invoice = {
        'customer': 'BigCo',
        'performances': [
            {
                'playID': 'hamlet',
                'audience': 28,
            },
            {
                'playID': 'as-like',
                'audience': 19,
            },
            {
                'playID': 'othello',
                'audience': 18,
            },
        ],
    };
    //when
    const result = statement(invoice, plays);

    console.log(result);
    let expected = "Statement for BigCo\n" +
        " Hamlet: $400.00 (28 seats)\n" +
        " As You Like It: $357.00 (19 seats)\n" +
        " Othello: $400.00 (18 seats)\n" +
        "Amount owed is $1,157.00\n" +
        "You earned 3 credits \n";
    //then
    t.is(result, expected);
});


const plays = {
    'hamlet': {
        'name': 'Hamlet',
        'type': 'tragedy',
    },
    'as-like': {
        'name': 'As You Like It',
        'type': 'comedy',
    },
    'othello': {
        'name': 'Othello',
        'type': 'tragedy',
    },
};