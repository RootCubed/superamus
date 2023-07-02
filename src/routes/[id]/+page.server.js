import fs from "fs";

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
