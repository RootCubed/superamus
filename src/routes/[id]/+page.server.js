import fs from "fs";

export function entries() {
    const index = JSON.parse(fs.readFileSync("regulations/index.json", "utf-8"));
    return index.reduce((acc, cur) => {
        acc.push(...cur.schools.map(e => ({ id: e.url })));
        return acc;
    }, []);
}

export const prerender = true;
export const trailingSlash = "always";

export function load({ params }) {
    if (!fs.existsSync(`regulations/${params.id}.json`)) {
        console.error(`Regulation file ${params.id} not found`);
        return {
            regulation: null
        };
    }

    const data = JSON.parse(fs.readFileSync(`regulations/${params.id}.json`, "utf-8"));
    return {
        regulation: data
    };
}
