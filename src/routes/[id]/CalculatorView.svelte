<script>
    import InputGroup from "./InputGroup.svelte";
    import ResultDisplay from "./ResultDisplay.svelte";
    
    import { browser } from "$app/environment";
    import { encodeState } from "./state";

    export let regulations, config, grades;

    let subjectData = [];
    let shareLink = "";
    let unroundedAverages = [];

    $: if (config) {
        subjectData = regulations.getSubjects(config);
        if (browser) {
            const url = new URL(window.location.href);
            url.searchParams.set("data", encodeState(config, grades));
            shareLink = url.href;
        }
    }

    $: if (grades && subjectData.every((subj) => subj.subjectID in grades)) {
        unroundedAverages = subjectData.map((subj) => {
            return regulations.calcAvg(config, subj.subjectID, grades[subj.subjectID]);
        });
    }
</script>

{#if config && grades}
    <ResultDisplay {unroundedAverages} {shareLink} />
    <div class="grade-input">
        {#each subjectData as { subjectID, name }}
            <InputGroup {regulations} {config} {subjectID} bind:subjGrades={grades[subjectID]} title={name} />
        {/each}
    </div>
{:else}
    <h2>Wird geladen...</h2>
{/if}

<style>
    h2 {
        text-align: center;
        padding: 20px;
    }

    .grade-input {
        overflow-x: auto;
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        grid-gap: 20px;
        padding: 10px;
    }

    @media screen and (min-width: 1500px) {
        .grade-input {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>
