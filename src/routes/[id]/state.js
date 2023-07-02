import LZString from "lz-string";

export function encodeState(config, grades) {
    const configStr = Object.entries(config).map(e => e.join(":")).join(",");
    const gradeStr = Object.entries(grades).map(e => e[0] + ":" + Object.entries(e[1]).map(e => e.join("$")).join("|")).join(",");
    return LZString.compressToEncodedURIComponent(configStr + "\n" + gradeStr);
}

export function decodeState(str) {
    const [configStr, gradeStr] = LZString.decompressFromEncodedURIComponent(str).split("\n");
    const configObj = Object.fromEntries(configStr.split(",").map(e => e.split(":")));
    const gradeObj = Object.fromEntries(gradeStr.split(",").map(e => {
        const spl = e.split(":");
        return [spl[0], Object.fromEntries(spl[1].split("|").map(e => {
            const spl = e.split("$");
            return [spl[0], parseFloat(spl[1])];
        }))];
    }));

    return [configObj, gradeObj];
}
