<script>
    export let data;
</script>

<div id="header">
    <h1>Maturrechner</h1>
</div>
<div id="content">
    <p>
        Dies ist ein Tool für die Maturnotenberechnung an den Schweizer Gymnasien.
        Aktuell sind folgende Schulen unterstützt:
    </p>
    <div id="school-list">
    {#each data.schools as groups}
        <h2>{groups.groupName}</h2>
        <ul>
            {#each groups.schools as school}
                <li>
                    <a href={school.url}>{school.schoolName}</a>
                </li>
            {/each}
        </ul>
    {/each}
    </div>

    <p>
        Weitere Schulen folgen...
    </p>
</div>

<style>
    #header {
        padding: 20px;
        background-color: #f5f5f5;
    }

    #content {
        padding: 20px;
    }

    #school-list {
        margin: 20px 0;
    }

    h2 {
        margin: 10px 0;
    }

    ul {
        margin-left: 20px;
    }
</style>
