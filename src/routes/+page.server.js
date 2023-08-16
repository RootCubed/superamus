import fs from "fs";

export const prerender = true;

export function load() {
    const data = JSON.parse(fs.readFileSync("regulations/index.json", "utf-8"));
    return {
        schools: data
    };
}
