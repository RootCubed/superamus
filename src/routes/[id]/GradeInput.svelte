<script context="module">
    let counter = 0;
</script>

<script>
    export let label;
    export let grade;
    let gradeInput;

    const inputID = "grade-input-" + counter++;

    function sanitizedGrade(grade) {
        return Math.round(Math.min(Math.max(grade, 1), 6) * 2) / 2;
    };

    function updateGrade() {
        const newVal = parseFloat(gradeInput.value);
        if (!isNaN(newVal)) {
            grade = sanitizedGrade(newVal);
        } else {
            grade = undefined;
            forceUpdateField();
        }
    }

    function forceUpdateField() {
        if (grade == undefined) {
            gradeInput.value = "";
        } else {
            gradeInput.value = grade;
        }
    }

    $: grade && gradeInput && forceUpdateField();
</script>

<div>
    <label for={inputID}>{label}</label>
    <div id="grade-input">
        <input type="text" id={inputID} placeholder="-"
            on:input={updateGrade}
            on:blur={forceUpdateField}
            bind:this={gradeInput} />
            <button id="decrement" on:click={() => grade = sanitizedGrade(grade - 0.5)} tabindex="-1">-</button>
            <button id="increment" on:click={() => grade = sanitizedGrade(grade + 0.5)} tabindex="-1">+</button>
    </div>
</div>

<style>
    #grade-input {
        display: grid;
        grid-template-columns: 70px 40px 40px;
        grid-gap: 0;
    }

    label {
        font-size: 0.9em;
    }

    input, button {
        appearance: none;
        -webkit-appearance: none;
        background-color: white;
        border: 1px solid black;
        border-radius: 0;
        color: black;
        font-size: 1.5em;
        text-align: center;
        touch-action: manipulation;
        user-select: none;
        -webkit-user-select: none;
    }

    input {
        padding: 2px;
    }
</style>
