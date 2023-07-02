const OPERATORS = {
    "|": {
        bindStrength: 0,
        func: (lhs, rhs) => lhs || rhs
    },
    "&": {
        bindStrength: 1,
        func: (lhs, rhs) => lhs && rhs
    },
    "!": {
        bindStrength: 2,
        func: (rhs) => !rhs
    }
};

const UNARY_OPERATORS = ["!"];

function tokenize(str) {
    const tokens = [];
    const regex = /\s*([a-zA-Z0-9_.]+|[\(\)&|!*])\s*/g;
    let match;
    while ((match = regex.exec(str)) != null) {
        tokens.push(match[1]);
    }
    return tokens;
}

function testMatchLiteral(literal, choices) {
    if (literal == "*") {
        return true;
    }
    const spl = literal.split(".");
    if (spl.length != 2) {
        throw new Error("Invalid literal: " + literal);
    }
    return choices[spl[0]] == spl[1];
}

function testMatchInternal(tokens, choices, minBindStrength) {
    if (tokens.length == 0) {
        throw new Error("Empty match string");
    }

    let lhs;
    if (tokens[0] == "(") {
        tokens.shift();
        lhs = testMatchInternal(tokens, choices, 0);
        if (tokens[0] != ")") {
            throw new Error("Expected ')'");
        }
        tokens.shift();
        if (tokens.length == 0) {
            return lhs;
        }
    } else if (UNARY_OPERATORS.includes(tokens[0])) {
        const op = tokens.shift();
        lhs = OPERATORS[op].func(testMatchInternal(tokens, choices, OPERATORS[op].bindStrength));
        if (tokens.length == 0) {
            return lhs;
        }
    } else {
        lhs = testMatchLiteral(tokens.shift(), choices);
    }

    while (tokens.length > 0 && tokens[0] != ")") {
        const op = tokens[0];
        if (!OPERATORS.hasOwnProperty(op)) {
            throw new Error("Invalid operator: " + op);
        }
        if (UNARY_OPERATORS.includes(op)) {
            throw new Error("Unary operator in wrong position: " + op);
        }
        if (OPERATORS[op].bindStrength < minBindStrength) {
            return lhs;
        }
        tokens.shift();
        lhs = OPERATORS[op].func(lhs, testMatchInternal(tokens, choices, OPERATORS[op].bindStrength));
    }
    return lhs;
}

export function testMatchStr(matchStr, choices) {
    const tokens = tokenize(matchStr);
    const res = testMatchInternal(tokens, choices, 0);
    if (tokens.length > 0) {
        throw new Error("Unexpected token: " + tokens[0]);
    }
    return res;
}
