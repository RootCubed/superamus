<script>
    import ShareModal from "./ShareModal.svelte"

    export let unroundedAverages;
    export let shareLink;

    let plusPoints, totalAverage, numGradesBelow4;

    $: {
        const roundedAverages = unroundedAverages.map(avg => Math.round(avg * 2) / 2);;

        plusPoints = roundedAverages.reduce((acc, avg) => {
            if (avg > 4) {
                return acc + (avg - 4);
            } else {
                return acc + (avg - 4) * 2;
            }
        }, 0);
        numGradesBelow4 = roundedAverages.filter(grade => (Math.round(grade * 2) / 2) < 4).length;
        totalAverage = roundedAverages.reduce((acc, grade) => acc + grade, 0) / roundedAverages.length;
    }

    let resultText, resultDetailText, resultClass;

    $: {
        const posPP = Math.abs(plusPoints);
        const ppStr = `${posPP} ${plusPoints < 0 ? "Minuspunkt" : "Pluspunkt"}${posPP == 1 ? "" : "e"}`;
        const avgStr = `⌀ ${totalAverage.toFixed(2)}`;

        if (plusPoints < 0 || numGradesBelow4 > 4) {
            resultText = `Nicht bestanden 😔`;
            resultDetailText = `${ppStr}, ${avgStr}`;
            if (!(plusPoints < 0)) {
                resultDetailText += ` (aber ${numGradesBelow4} Fächer liegen unter 4)`;
            }
            resultClass = "failed";
        } else {
            resultText = `Bestanden 🥳`;
            resultDetailText = `${ppStr}, ${avgStr}`;
            resultClass = "passed";
        }
    }

    let showModal = false;
    let shareContainer;

    function clickEv(ev) {
        if (showModal && !shareContainer.contains(ev.target)) {
            showModal = false;
        }
    }
</script>

<svelte:window on:click={clickEv}/>

<div id="passed-result" class={resultClass}>
    <span id="result-announce">{resultText}</span>
    <span id="result-detail">{resultDetailText}</span>
    {#if shareLink}
    <div id="share-button-cont" bind:this={shareContainer}>
        <button on:click={() => showModal = true}>Teilen</button>
        <ShareModal url={shareLink} bind:showModal />
    </div>
    {/if}
</div>


<style>
    #passed-result {
        z-index: 2;
        font-size: 1.3em;
        padding: 5px 10px;
        position: sticky;
        top: 0;
        background-color: #fff;
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-areas: 
            "result-announce share-button-cont"
            "result-detail share-button-cont";
        align-items: center;
    }

    #passed-result.passed {
        background-color: #9bf29b;
    }

    #passed-result.failed {
        background-color: #fcc;
    }

    #result-announce {
        grid-area: result-announce;
        font-weight: bold;
        justify-self: center;
    }

    #result-detail {
        grid-area: result-detail;
        font-size: 0.7em;
        justify-self: center;
    }

    #share-button-cont {
        grid-area: share-button-cont;
        position: relative;
    }

    #share-button-cont button {
        font-size: 0.7em;
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        color: rgb(0, 132, 255);
        padding: 10px;
    }
</style>
