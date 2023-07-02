import { parseCalcStr } from "./calcFunction";
import { testMatchStr } from "./matchString";

function resolvePossibleSwitch(obj, choices) {
    if (Array.isArray(obj)) {
        for (const opt of obj) {
            if (testMatchStr(opt.match, choices)) {
                return opt.value;
            }
        }
        return null;
    }
    return obj;
}

export class Regulations {
    constructor(regulationData) {
        // Make local copy
        const rd = JSON.parse(JSON.stringify(regulationData));

        this.schoolName = rd.schoolName;
        this.uncertainties = rd.uncertainties;
        this.source = rd.source;
        this.choices = rd.choices;
        this.invalidChoiceCombinations = rd.invalidChoiceCombinations;
        this.gradeTypes = rd.gradeTypes;
        this.gradeCalculations = rd.gradeCalculations;
        this.subjects = rd.subjects;
    }

    isAllowed(choices) {
        for (const comb of this.invalidChoiceCombinations) {
            const foundAll = comb.every(e => testMatchStr(e, choices));
            if (foundAll) {
                console.log("Invalid combination", comb);
                return false;
            }
        }
        return true;
    }

    resolveGradeName(gradeID) {
        if (gradeID.includes("|+")) {
            const spl = gradeID.split("|+");
            return this.resolveGradeName(spl[0]) + spl[1];
        } else if (gradeID.includes("|")) {
            return gradeID.split("|")[1];
        } else {
            return this.gradeTypes[gradeID];
        }
    }

    getChoices(choices) {
        return this.choices
            .filter(c => !c.hideCondition || !c.hideCondition.some(e => testMatchStr(e, choices)))
            .map(c => ({ choiceID: c.id, name: c.displayName }));
    }

    getChoiceOptions(choiceID, choices) {
        const res = [];

        const choice = this.choices.find(c => c.id == choiceID);
        if (choice == undefined) {
            throw new Error(`Choice ${choiceID} not found`);
        }

        for (const opt in choice.options) {
            let obj = { optionID: opt, name: choice.options[opt], invalid: false };
            let choiceCopy = Object.assign({}, choices);
            choiceCopy[choiceID] = opt;
            if (!this.isAllowed(choiceCopy)) {
                obj.invalid = true;
            }
            res.push(obj);
        }

        return res;
    }

    getSubjects(config) {
        const res = [];

        for (const subj of this.subjects) {
            res.push({
                subjectID: subj.id,
                name: resolvePossibleSwitch(subj.displayName, config)
            });
        }

        return res;
    }

    getGradeFields(config, subjectID) {
        const subj = this.subjects.find(s => s.id == subjectID);
        let gs = resolvePossibleSwitch(subj.gradingScheme, config);
        return gs.gradeFields.map(e => ({
            gradeID: e.split("|")[0],
            name: this.resolveGradeName(e)
        }));
    }

    getCalculationStr(config, subjectID) {
        const subj = this.subjects.find(s => s.id == subjectID);
        const gradingScheme = resolvePossibleSwitch(subj.gradingScheme, config);
        const gradeCalculation = this.gradeCalculations[gradingScheme.calculation];
        
        if (gradeCalculation == undefined) {
            throw new Error(`Grade calculation ${gradingScheme.calculation} not found`);
        }

        return gradeCalculation;
    }

    calcAvg(config, subjectID, grades) {
        const gradeCalculation = this.getCalculationStr(config, subjectID);

        try {
            return parseCalcStr(gradeCalculation).eval(grades);
        } catch (e) {
            console.error(`Error while calculating average for ${subjectID}: ${e}`);
            return NaN;
        }
    }

    getCalcStr(config, subjectID) {
        const gradeCalculation = this.getCalculationStr(config, subjectID);

        try {
            const gradeFields = {};
            for (const gf of this.getGradeFields(config, subjectID)) {
                gradeFields[gf.id] = gf.name;
            }
            return parseCalcStr(gradeCalculation).getCalcStr(gradeFields);
        } catch (e) {
            console.error(`Error while getting calculation string for ${subjectID}: ${e}`);
            return NaN;
        }
    }

    getGradeWeights(config, subjectID, grades) {
        const gradeCalculation = this.getCalculationStr(config, subjectID);
        
        try {
            return parseCalcStr(gradeCalculation).getGradeWeights(grades);
        } catch (e) {
            console.error(`Error while calculating grade weights for ${subjectID}: ${e}`);
            return {};
        }
    }
};
