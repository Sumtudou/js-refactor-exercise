const test = require('ava');
const {statement} = require('../src/statement');

test('BigCo number all over 30', t => {
    //given
    const invoice = {
        'customer': 'BigCo',
        'performances': [
            {
                'playID': 'the-tragedy',
                'audience': 55,
            },
            {
                'playID': 'the-comedy',
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
        " the-tragedy: $650.00 (55 seats)\n" +
        " isComedy: $580.00 (35 seats)\n" +
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
                'playID': 'the-tragedy',
                'audience': 28,
            },
            {
                'playID': 'the-comedy',
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

    let expected = "Statement for BigCo\n" +
        " the-tragedy: $400.00 (28 seats)\n" +
        " isComedy: $357.00 (19 seats)\n" +
        " Othello: $400.00 (18 seats)\n" +
        "Amount owed is $1,157.00\n" +
        "You earned 3 credits \n";
    //then
    t.is(result, expected);
});


test('BigCo 35 tragdy 19 comedy', t => {
    //given
    const invoice = {
        'customer': 'BigCo',
        'performances': [
            {
                'playID': 'the-tragedy',
                'audience': 35,
            },
            {
                'playID': 'the-comedy',
                'audience': 19,
            }
        ],
    };
    //when
    const result = statement(invoice, plays);

    let expected = "Statement for BigCo\n" +
        " the-tragedy: $450.00 (35 seats)\n" +
        " isComedy: $357.00 (19 seats)\n" +
        "Amount owed is $807.00\n" +
        "You earned 8 credits \n"
    //then
    t.is(result, expected);
});

const plays = {
    'the-tragedy': {
        'name': 'the-tragedy',
        'type': 'tragedy',
    },
    'the-comedy': {
        'name': 'isComedy',
        'type': 'comedy',
    },
    'othello': {
        'name': 'Othello',
        'type': 'tragedy',
    },
};