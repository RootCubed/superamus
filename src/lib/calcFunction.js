
const FN_MATCH = /^([a-zA-Z_][a-zA-Z0-9_.]*)\((.+)\)/;
const ARG_MATCH = /^([a-zA-Z_][a-zA-Z0-9_.]*)\s*(\*|\/)?\s*/;
const NUM_MATCH = /^([0-9]+(?:\.[0-9]+)?)/;

const FUNCS = {
    RoundedAvg: (args) => {
        let sum = args.reduce((a, b) => a + b, 0);
        return Math.round(sum / args.length * 2) / 2;
    },
    Avg: (args) => {
        let sum = args.reduce((a, b) => a + b, 0);
        return sum / args.length;
    },
    WeightedAvg: (args) => {
        let sum = 0;
        let weightSum = 0;
        for (let i = 0; i < args.length; i += 2) {
            sum += args[i] * args[i + 1];
            weightSum += args[i + 1];
        }
        return sum / weightSum;
    },
    Frac: (args) => {
        return args[0] / args[1];
    }
}

const FUNC_DISPLAY_NAMES = {
    RoundedAvg: (args) => {
        return `⌀(${args.join(", ")})`;
    },
    Avg: (args) => {
        return `⌀(${args.join(", ")})`;
    },
    WeightedAvg: (args) => {
        let str = "⌀(";
        for (let i = 0; i < args.length; i += 2) {
            if (i > 0) {
                str += ", ";
            }
            str += `${args[i]} (Gew. ${args[i + 1]})`;
        }
        str += ")";
        return str;
    },
    Frac: (args) => {
        return `${args[0]} / ${args[1]}`;
    }
}

const GRADE_WEIGHT_CALC = {
    RoundedAvg: (args, gradeWeights) => {
        let res = {};
        for (const gw of gradeWeights) {
            for (const [grade, weight] of Object.entries(gw)) {
                if (!res.hasOwnProperty(grade)) {
                    res[grade] = 0;
                }
                res[grade] += weight / args.length;
            }
        }
        return res;
    },
    Avg: (args, gradeWeights) => {
        let res = {};
        for (const gw of gradeWeights) {
            for (const [grade, weight] of Object.entries(gw)) {
                if (!res.hasOwnProperty(grade)) {
                    res[grade] = 0;
                }
                res[grade] += weight / args.length;
            }
        }
        return res;
    },
    WeightedAvg: (args, gradeWeights) => {
        let totalWeight = 0;
        for (let i = 0; i < args.length; i += 2) {
            totalWeight += args[i + 1];
        }
        let res = {};
        for (let i = 0; i < args.length; i += 2) {
            for (const [grade, weight] of Object.entries(gradeWeights[i])) {
                if (!res.hasOwnProperty(grade)) {
                    res[grade] = 0;
                }
                res[grade] += weight * args[i + 1] / totalWeight;
            }
        }
        return res;
    },
    Frac: (args, gradeWeights) => {
        return gradeWeights;
    }
}
        
const parseCalcStrHelper = (str) => {
    const fnMatch = str.match(FN_MATCH);
    const argMatch = str.match(ARG_MATCH);
    const numMatch = str.match(NUM_MATCH);
    if (fnMatch != null) {
        const fnName = fnMatch[1];
        const fnArgsStr = fnMatch[2];
        let fnArgs = [];
        let pos = 0;
        while (pos < fnArgsStr.length && fnArgsStr[pos] != ")") {
            const [arg, len] = parseCalcStrHelper(fnArgsStr.slice(pos));
            fnArgs.push(arg);
            pos += len;
            if (fnArgsStr[pos] == ",") {
                pos++;
            }
            while (fnArgsStr[pos] == " ") {
                pos++;
            }
        }
        return [{
            eval: (grades) => {
                return FUNCS[fnName](fnArgs.map(e => e.eval(grades)))
            },
            getCalcStr: () => {
                return FUNC_DISPLAY_NAMES[fnName](fnArgs.map(e => e.getCalcStr()));
            },
            getGradeWeights: (grades) => {
                return GRADE_WEIGHT_CALC[fnName](
                    fnArgs.map(e => e.eval(grades)),
                    fnArgs.map(e => e.getGradeWeights(grades))
                );
            }
        }, fnName.length + pos + 2]; // +2 for the parentheses
    } else if (argMatch != null) {
        const arg = argMatch[1];
        return [{
            eval: (grades) => {
                if (!(arg in grades)) {
                    throw new Error(`Invalid grade: ${arg}`);
                }
                return grades[arg];
            },
            getCalcStr: () => `<pre style="display: inline; font-family: monospace; font-weight: bold; color: #EC88EA;">${arg}</pre>`,
            getGradeWeights: () => ({[arg]: 1})
        }, argMatch[0].length];
    } else if (numMatch != null) {
        const num = parseFloat(numMatch[1]);
        return [{
            eval: () => num,
            getCalcStr: () => num.toString(),
            getGradeWeights: () => ({})
        }, numMatch[1].length];
    } else {
        throw new Error(`Invalid calculation string: ${str}`);
    }
}

export function parseCalcStr(str) {
    return parseCalcStrHelper(str)[0];
}
