<script>
    import CalculatorView from "./CalculatorView.svelte";
    import ElectiveChooser from "./ElectiveChooser.svelte";
    import { Regulations } from "$lib/regulations";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { decodeState } from "./state";

	export let data;

    const regulations = new Regulations(data.regulation);

    let config = null;
    let grades = null;
    let schoolID;
    let storeToLocalStorage = true;

    onMount(() => {
        schoolID = $page.params["id"];

        let couldLoad = false;

        if ($page.url && $page.url.searchParams.has("data")) {
            const [configObj, gradeObj] = decodeState($page.url.searchParams.get("data"));

            config = configObj;
            grades = gradeObj;

            couldLoad = true;
            storeToLocalStorage = false;
        } else if (localStorage) {
            if (localStorage[`config.${schoolID}`] && localStorage[`grades.${schoolID}`]) {
                config = JSON.parse(localStorage[`config.${schoolID}`]);
                grades = JSON.parse(localStorage[`grades.${schoolID}`]);

                couldLoad = true;
            }
        }

        if (!couldLoad) {
            config = {};
            grades = {};
        }
    });
    
    $: if (schoolID && config && grades && localStorage && storeToLocalStorage) {
        localStorage[`config.${schoolID}`] = JSON.stringify(config);
        localStorage[`grades.${schoolID}`] = JSON.stringify(grades);
    }
</script>

<div id="header">
    <h1>Maturrechner {regulations.schoolName}</h1>
    <p>Die Notenberechnung basiert auf den folgenden Dokumenten (abgefragt {regulations.source.accessed}):</p>
    {#each regulations.source.urls as source, i}
        <span class="source-ref">Link {i + 1}: <a href={source} target="_blank">{source}</a></span>
    {/each}
    {#if regulations.uncertainties.length > 0}
        <div id="uncertainties">
            <span class="title">Hinweis:</span>
            <p class="details">
                Der Urheber der Reglementdatei für diesen Notenrechner hat angegeben,
                dass es Unsicherheiten bei dem Maturreglement dieser Schule gibt und
                somit die Noteneingabe/Notenberechnung möglicherweise nicht ganz stimmt.
            </p>
            <p class="details">
                Falls Du glaubst, diese klären zu können, würde ich mich sehr freuen, wenn Du auf
                <a href="https://github.com/RootCubed/matura-calculator/issues">GitHub</a>
                einen Issue erstellen würdest.
            </p>
            <p class="details">
                Folgende Unsicherheiten wurden angegeben:
            </p>
            <ul>
                {#each regulations.uncertainties as uncertainty}
                    <li>{uncertainty}</li>
                {/each}
            </ul>
        </div>
    {/if}
</div>
<div id="content">
    <ElectiveChooser {regulations} bind:config />
    <span class="line"></span>
    <CalculatorView {regulations} {config} bind:grades />
</div>

<style>
    #header {
        padding: 20px;
        background-color: #f5f5f5;
    }

    #uncertainties {
        margin-top: 10px;
        padding: 20px;
        background-color: #ffcb50;
    }

    span.title {
        font-size: 1.7em;
        display: block;
        font-weight: bold;
        margin-bottom: 10px;
    }

    p.details {
        display: block;
        margin-bottom: 20px;
    }

    ul {
        margin-left: 20px;
    }

    .line {
        display: block;
        width: 100%;
        height: 1px;
        background-color: #eee;
        margin: 0 0 20px;
    }

    span.source-ref {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
    }
</style>
