const TOKEN_TYPES = {
    func: /^([a-z_][a-z\d_.]*)\(/i,
    arg: /^([a-z_][a-z\d_.]*)/i,
    num: /^(\d+(?:\.\d+)?)/,
    closeParen: /^\)/,
    comma: /^,/
};

function parseExpr(tokens) {
    if (tokens.length == 0) {
        throw new Error("Unexpected end of calculation string");
    }

    if (tokens[0].match(TOKEN_TYPES.func)) {
        return new GradeCalculationFunc(tokens);
    } else if (tokens[0].match(TOKEN_TYPES.arg)) {
        return new GradeCalculationArg(tokens);
    } else if (tokens[0].match(TOKEN_TYPES.num)) {
        return new GradeCalculationNum(tokens);
    } else {
        throw new Error(`Unexpected token: ${tokens[0]}`);
    }
}

class GradeCalculationFunc {
    constructor(tokens) {
        const fnName = tokens.shift().slice(0, -1);
        const args = [];
        while (tokens.length > 0 && tokens[0] != ")") {
            args.push(parseExpr(tokens));
            if (tokens[0] == ",") {
                tokens.shift();
            }
        }
        if (tokens.length == 0) {
            throw new Error(`Expected closing parenthesis for function ${fnName}`);
        }
        tokens.shift();

        this.type = "func";
        this.name = fnName;
        this.args = args;
    }

    eval(grades) {
        const args = this.args.map((a) => a.eval(grades));

        if (this.name == "Frac") {
            return args[0] / args[1];
        }

        if (this.name == "Round") {
            return Math.round(args[0] * 2) / 2;
        }

        if (this.name == "WeightedAvg") {
            let sum = 0;
            let weightSum = 0;
            for (let i = 0; i < args.length; i += 2) {
                sum += args[i] * args[i + 1];
                weightSum += args[i + 1];
            }
            return sum / weightSum;
        }
        
        let res = args.reduce((a, b) => a + b, 0) / args.length;
        return res;
    }

    prettyPrint() {
        const args = this.args.map((a) => a.prettyPrint());
        switch (this.name) {
            case "Avg":
                return `⌀(${args.join(", ")})`;
            case "WeightedAvg":
                let str = "⌀(";
                for (let i = 0; i < args.length; i += 2) {
                    if (i > 0) {
                        str += ", ";
                    }
                    str += `${args[i]} (Gew. ${args[i + 1]})`;
                }
                str += ")";
                return str;
            case "Round":
                return `|${args[0]}|`;
            case "Frac":
                return `${args[0]}/${args[1]}`;
        }
    }

    getWeights() {
        if (this.name == "Frac") {
            return {};
        }

        if (this.name == "Round") {
            return this.args[0].getWeights();
        }

        let argWeightObjs = [];
        let argWeights = [];
        if (this.name == "WeightedAvg") {
            for (let i = 0; i < this.args.length; i += 2) {
                argWeightObjs.push(this.args[i].getWeights());
                argWeights.push(this.args[i + 1].eval({}));
            }
        } else {
            argWeightObjs = this.args.map((a) => a.getWeights());
            argWeights = this.args.map(() => 1 / this.args.length);
        }
        
        const res = {};
        for (let i = 0; i < argWeightObjs.length; i++) {
            for (const [grade, weight] of Object.entries(argWeightObjs[i])) {
                if (!res.hasOwnProperty(grade)) {
                    res[grade] = 0;
                }
                res[grade] += weight * argWeights[i];
            }
        }

        return res;
    }
}

class GradeCalculationArg {
    constructor(tokens) {
        const arg = tokens.shift();

        this.type = "arg";
        this.name = arg;
    }

    eval(grades) {
        return grades[this.name];
    }

    prettyPrint() {
        return `[${this.name}]`;
    }

    getWeights() {
        return { [this.name]: 1 };
    }
}

class GradeCalculationNum {
    constructor(tokens) {
        const num = tokens.shift();

        this.type = "num";
        this.value = parseFloat(num);
    }

    eval(_grades) {
        return this.value;
    }

    prettyPrint() {
        return this.value.toString();
    }

    getWeights() {
        return {};
    }
}


export class GradeCalculation {
    constructor(str) {
        const tokens = this.tokenize(str);
        this.expr = parseExpr(tokens);
    }

    tokenize(str) {
        const tokens = [];
        let pos = 0;
        while (pos < str.length) {
            let found = false;
            for (const r of Object.values(TOKEN_TYPES)) {
                // Skip whitespace
                while (str[pos] == " ") {
                    pos++;
                }

                const match = str.slice(pos).match(r);
                if (match != null) {
                    tokens.push(match[0]);
                    pos += match[0].length;
                    found = true;
                    break;
                }
            }
            if (!found) {
                throw new Error(`Couldn't tokenize calculation string: ${str}`);
            }
        }
        return tokens;
    }

    eval(grades) {
        return this.expr.eval(grades);
    }

    prettyPrint() {
        return this.expr.prettyPrint();
    }

    getWeights() {
        return this.expr.getWeights();
    }
};
