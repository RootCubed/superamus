<script>
    export let regulations;
    export let config;

    let choices;
    $: if (config) {
        choices = regulations.getChoices(config);
        
        // Need to remove the selection key-value pair if it is no longer visible
        for (const choiceID in config) {
            if (!choices.some(c => c.choiceID == choiceID)) {
                delete config[choiceID];
            } else if (config[choiceID] == " ") {
                delete config[choiceID];
            }
        }
    }
</script>

<div id="component">
    <h2>Einstellungen</h2>
    {#if config}
    {#each choices as {choiceID, name}}
    <div class="elective-chooser">
        <label for={choiceID}>{name}</label>
        <select id={choiceID} bind:value={config[choiceID]}>
            <option value=" "></option>
            {#each regulations.getChoiceOptions(choiceID, config) as option}
                <option value={option.optionID} disabled={option.invalid}>{option.name}</option>
            {/each}
        </select>
    </div>
    {/each}
    {/if}
</div>

<style>
    #component {
        padding: 20px;
    }

    .elective-chooser {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-gap: 10px;
        margin: 10px 0;
        max-width: 500px;
    }
    
    select {
        color: black;
    }
</style>
