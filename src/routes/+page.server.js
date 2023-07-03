import fs from "fs";

export function load() {
    const data = JSON.parse(fs.readFileSync("regulations/index.json", "utf-8"));
    return {
        schools: data
    };
}
