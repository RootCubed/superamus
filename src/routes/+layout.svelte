<svelte:head>
    <title>Superamus</title>
    <meta name="description" content="Der Maturnotenrechner für Schweizer Gymnasien">
    <meta name="author" content="Liam Braun">
    <meta name="keywords" content="Maturnoten, Maturrechner, Matura, Gymi, Kanti">
    <meta content="Superamus" property="og:title" />
    <meta content="Der Maturnotenrechner" property="og:description" />
</svelte:head>

<div id="app">
    <div id="content">
        <slot />
    </div>
    <div id="footer">
        <span>
        Quellcode für diese Seite: <a href="https://github.com/RootCubed/superamus" target="_blank">https://github.com/RootCubed/superamus</a><br>
        &copy; 2023 Liam Braun. Alle Angaben ohne Gewähr.
        </span>
    </div>
</div>

<style>
    :global(*) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: Helvetica, Arial, sans-serif;
        -webkit-text-size-adjust: 100%;
    }

    #app {
        height: 100vh;
        display: flex;
        flex-direction: column;
    }

    #content {
        flex-grow: 1;
    }

    #footer {
        padding: 20px;
        background-color: #f5f5f5;
        text-align: center;
        font-size: 0.85em;
        line-height: 1.5;
        flex-shrink: 0;
    }
</style>
