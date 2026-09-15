module.exports.generateRandomNumber = (length) => {
    const characters = "0123456789";
    let result = "";
    for (let k = 0; k < length; k++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
