<script>
    import GradeCalcInfo from "./GradeCalcInfo.svelte";
    import GradeInput from "./GradeInput.svelte";
    
    export let regulations, config, subjectID, subjGrades;

    export let title;

    const gradeColors = [
        "#F70E0E55", // 1
        "#E2441255", // 1.5
        "#EE571B55", // 2
        "#EA722A55", // 2.5
        "#DD993355", // 3
        "#DDBA3355", // 3.5
        "#7EEA5F55", // 4
        "#A3EA4E77", // 4.5
        "#63DB2C77", // 5
        "#3EF74677", // 5.5
        "#14FF0077", // 6
    ];

    let finalUnroundedGrade = 4;
    let finalGrade = 4;

    let calculationString = "";
    let weights = [];

    let fields = [];

    let component;

    function recalculateGrades(config, subjectID, subjGrades) {
        fields = regulations.getGradeFields(config, subjectID);
        
        if (!subjGrades) {
            subjGrades = {};
        }
        
        for (const { gradeID } of fields) {
            if (!subjGrades.hasOwnProperty(gradeID)) {
                subjGrades[gradeID] = 4;
            }
        }
        
        finalUnroundedGrade = regulations.calcAvg(config, subjectID, subjGrades);
        finalGrade = (Math.round(finalUnroundedGrade * 2) / 2).toFixed(1);
        
        if (component) {
            component.style.setProperty("--bg-color", gradeColors[(finalGrade - 1) * 2]);
        }
        
        calculationString = regulations.getCalcStr(config, subjectID, subjGrades);
        weights = regulations.getGradeWeights(config, subjectID, subjGrades);

        return subjGrades;
    }
    
    $: subjGrades = recalculateGrades(config, subjectID, subjGrades);
</script>

<div id="component" bind:this={component}>
    <span class="title">{title}:</span>
    <span class="final-grade">{finalGrade}</span>
    {#if fields.length > 1}
    <GradeCalcInfo {calculationString} {weights} />
    {/if}
    <div class="input-group">
        {#each fields as field}
            <GradeInput label={field.name} bind:grade={subjGrades[field.gradeID]} />
        {/each}
    </div>
</div>

<style>
    .input-group {
        margin-top: 10px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
        grid-gap: 5px;
        align-items: center;
    }

    #component {
        --bg-color: #DFE616;
        background-color: var(--bg-color);
        padding: 10px;
    }
    
    .title {
        font-weight: bold;
    }

    .final-grade {
        padding: 5px;
        font-size: 1.2em;
        font-weight: bold;
        background-color: #ddd;
    }
</style>
