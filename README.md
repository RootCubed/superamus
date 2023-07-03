# MatCalc - Matura Calculator for Swiss Gymnasiums

This is a tool that you can use to figure out what grades you need to get on your final exams to pass the matura. It is easily extensible to support more schools.

## Adding your school to MatCalc

Adding your school to MatCalc does not involve writing any code. Instead, you write a file that describes the matura regulation of your school. The format of this file is described here, but I suggest looking at some existing regulation files to get an overview of how it works and come back here for more explanation on certain parts.

### Suggested workflow for adding a school

#### 1. Fork this repository and clone it to your computer.

#### 2. Create a new branch for your school.

#### 3. Make a copy of the file `regulations/template.json` and name it `<school abbreviation>.json`.

#### 4. Fill out the choices array:

For each choice that a student can make and that affects what grades contribute to a subject's final grade (or how they affect it), create a `Choice` in the `choices` array.

#### 5. Fill out the invalidChoiceCombinations array:

If there are certain combinations of choices that are not allowed, create the necessary invalid choice specifiers in the `invalidChoiceCombinations` array.

#### 6. Create grading schemes:

Create grade types and grade calculations while doing this step. 

## Regulation file format

### General format
The file is placed in the folder `regulations` and is called `<school abbreviation>.json`. It is a JSON file.

The top-level object has the following properties:

- `schoolName`: This is the name of the school. It shows up in the title of the page.
- `source`: Please put links to all documents you used as a reference for the regulation. This makes it easier for someone to double-check if your description is correct.
- `choices`: This is an array of `Choice`s that the student can make. See the section below on the format of a `Choice`.
- `invalidChoiceCombinations`: This is an array of `ChoiceCombination`s. A `ChoiceCombination` is an array of MatchStrings. If all MatchStrings in a ChoiceCombination evaluate to true, the combination of choices is invalid. This is useful if a school has a rule that certain choices cannot be combined.
- `gradeTypes`: This is an object that contains the different types of grades that can be given. The key is the internal ID and the value is how it will be shown to the user in the grade input.
- `gradeCalculations`: This is an object that contains the different ways that grades can be calculated. The key is the internal ID and the value is a `CalculationString`. See the section below for more information on the format of a `CalculationString`.
- `subjects`: This is an array of `Subject`s. See the section below for more information on the format of a `Subject`.

### Data types

**`Choice`**

- `id`: This is an internal name for the choice.
- `displayName`: This is what the option picker will show.
- `options`: This is an object that contains the possible options for the choice. The key is the internal ID and the value is how it will be shown to the user.
- `showCondition` (optional): The choice will only be shown if this `MatchString` evaluates to true. If omitted, the choice is always shown.

**`MatchString`**

This is a string describes a combination of choices. It is a string that contains the ID of a choice and the ID of the option, separated by a period. You can also combine multiple choices with boolean operators:

- `&` (AND): Evaluates to true if both operands evaluate to true.
- `|` (OR): Evaluates to true if at least one operand evaluates to true.
- `!` (NOT): Evaluates to true if the operand evaluates to false.

Example: The following `MatchString` evaluates to true if the choice `profile` is not `N` and the choice `bgmu` is `MU`: `!profile.N | bgmu.MU`.

**`CalculationString`**

This is a string that describes a calculation of the final grade of a subject (Note: the final rounding to 0.5 is done automatically, this should not be done manually). You can write this as a mathematical term. Additionally, you can use the following functions:

- `Avg(<grade1>, <grades>, ...)`: This calculates the average of the given grades.
- `WeightedAvg(<grade1>, <weight1>, <grade2>, <weight2>, ...)`: This calculates the weighted average of the given grades and weights.
- `Frac(<numerator>, <denominator>)`: This calculates the fraction of the given numerator and denominator.

Example: `Avg(AvgWeighted(grade1, 0.2, grade2, 0.8), grade3)`. Here, `grade1` and `grade2` are averaged together with weights 0.2 and 0.8 respectively. Then, the result is averaged together with `grade3`. (So, effectively, `grade1` counts 10%, `grade2` 40% and `grade3` 50% towards the final grade.)

**`Match<T>`**

This is an array of objects which have a `match` and a `value` property. The `match` is a MatchString and the `value` is of type `T` and is the value that will be returned if the corresponding `match` evaluates to true.

**`Subject`**

- `id`: This is an internal name for the subject.
- `displayName` (either `string` or `Match<string>`): This is what the subject will be called in the UI.
- `gradingScheme` (either `GradingScheme` or `Match<GradingScheme>`): This is the grading scheme that is used for this subject. See the section below for more information on the format of a `GradingScheme`.

**`GradingScheme`**

- `gradeFields`: This is an array of IDs from the `gradeTypes` object. The grades that the student gets in these fields will be used to calculate the final grade.
- `gradeCalculation`: This is an ID from the `gradeCalculations` object. This is the calculation that will be used to calculate the final grade.
