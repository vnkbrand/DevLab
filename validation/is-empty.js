//  Specialised Validator that looks for empty inputs (emails etc.), values, strings so that it can reject it on the server-side

const isEmpty = value => 

    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0);

module.exports = isEmpty;