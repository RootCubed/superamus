<script>
	export let showModal;
    export let url;

	let dialog, urlField;

    $: if (dialog && showModal) {
        dialog.style.display = "flex";
        urlField.focus();
        urlField.select();
    }
    
    $: if (dialog && !showModal) {
        dialog.style.display = "none";
    }
</script>

<div id="dialog" bind:this={dialog} style="display: none;">
    <span>Link zu diesem Ergebnis:</span>
    <textarea bind:this={urlField} on:click={() => (urlField.select())} type="text" rows=5 readonly>{url}</textarea>
</div>

<style>
	#dialog {
		background: #333;
        position: absolute;
        right: 0;
        padding: 10px;
        display: flex;
        flex-direction: column;
	}

    #dialog span {
        color: white;
        font-size: 0.8em;
    }

    textarea {
        padding: 5px;
        margin-top: 10px;
        border: none;
        font-size: 16px;
        resize: none;
    }
</style>
