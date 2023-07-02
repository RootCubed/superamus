<script>
    export let calculationString, weights;

    const colors = [
        "#EC6B56",
        "#FFC154",
        "#47B39C",
        "#2085EC"
    ];
    
    const PIE_RADIUS = 50;
    const LEGEND_SQUARE_SIZE = 15;

    function calculatePieChartPositions() {
        let sum = 0;
        return Object.entries(weights).map(([name, weight], i) => {
            const angle = weight * 360;
            const color = colors[i];

            const startX = Math.sin(sum) * PIE_RADIUS;
            const startY = -Math.cos(sum) * PIE_RADIUS;
            
            sum += angle / 180 * Math.PI;

            const endX = Math.sin(sum) * PIE_RADIUS;
            const endY = -Math.cos(sum) * PIE_RADIUS;

            const res = {
                name,
                color,
                path: `M ${startX} ${startY} A ${PIE_RADIUS} ${PIE_RADIUS} ${angle} ${angle > 180 ? 1 : 0} 1 ${endX} ${endY} L 0 0 Z`
            }
            return res;
        });
    }

    $: pieChartPositions = calculatePieChartPositions();

    let tooltip;
    function recalculateTooltipPosition() {
        tooltip.style.setProperty("--tooltip-left", "-50%");
        tooltip.style.setProperty("--tooltip-arrow-left", "50%");

        const bb = tooltip.getBoundingClientRect();
        if (bb.left < 0) {
            tooltip.style.setProperty("--tooltip-left", "-10px");
            tooltip.style.setProperty("--tooltip-arrow-left", "10px");
        } else if (bb.right > window.innerWidth) {
            tooltip.style.setProperty("--tooltip-left", "calc(-100% + 10px)");
            tooltip.style.setProperty("--tooltip-arrow-left", "calc(100% - 10px)");
        }
        
    }

</script>

<div class="grade-info" role="button" tabindex="-1"
    on:mouseover={recalculateTooltipPosition} on:focus={recalculateTooltipPosition}>
    <div class="grade-calc-info" bind:this={tooltip}>
        <p>
            Berechnung:<br>
            {@html calculationString}
        </p>
        <svg viewBox="{-PIE_RADIUS} {-PIE_RADIUS} {PIE_RADIUS * 2} {PIE_RADIUS * 2 + pieChartPositions.length * LEGEND_SQUARE_SIZE}">
            {#each pieChartPositions as data}
                <path d={data.path} fill={data.color} />
            {/each}
            {#each pieChartPositions as data, i}
                <rect x={-PIE_RADIUS} y={PIE_RADIUS + i * LEGEND_SQUARE_SIZE} width={LEGEND_SQUARE_SIZE} height={LEGEND_SQUARE_SIZE} fill={data.color} />
                <text
                    font-size="9"
                    x={-PIE_RADIUS + LEGEND_SQUARE_SIZE + 5}
                    y={PIE_RADIUS + i * LEGEND_SQUARE_SIZE}
                    fill="white">
                    <tspan dy="1.2em">{data.name}</tspan>
                </text>
            {/each}
        </svg>
    </div>
</div>

<style>
    .grade-info {
        display: inline-block;
        margin-left: 10px;
        --tooltip-left: -50%;
        --tooltip-arrow-left: 50%;
        color: white;
    }

    .grade-info::before {
        content: "?";
        border-radius: 100%;
        width: 20px;
        height: 20px;
        display: inline-block;
        text-align: center;
        background-color: #1e1e1e;
        cursor: default;
        user-select: none;
        font-weight: bold;
    }

    .grade-calc-info {
        visibility: hidden;
        position: absolute;
        background-color: #1e1e1e;
        text-align: center;
        padding: 10px;
        margin-top: -35px;
        margin-left: 10px;
        transform: translate(var(--tooltip-left), -100%);
        z-index: 2;
    }

    .grade-calc-info::before {
        content: "";
        position: absolute;
        top: 100%;
        left: var(--tooltip-arrow-left);
        margin-left: -10px;
        border-width: 10px;
        border-style: solid;
        border-color: #1e1e1e transparent transparent transparent;
    }

    .grade-info:hover .grade-calc-info {
        visibility: visible;
    }

    .grade-calc-info svg {
        width: 150px;
    }

    .grade-calc-info p {
        margin-bottom: 10px;
    }
</style>
