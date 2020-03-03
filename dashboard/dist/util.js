const uintInc = {
    "": "K",
    K: "M",
    M: "G",
    G: null
};

function unitFormat(value, unit = "") {
    if (value > 1024 && uintInc[unit]) {
        return unitFormat(value / 1024, uintInc[unit]);
    }
    return value.toFixed(2).replace(".00", "") + unit + "B";
}