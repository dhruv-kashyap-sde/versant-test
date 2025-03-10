function generateTin() {
    let tin = '';
    for (let i = 0; i < 10; i++) {
        tin += Math.floor(Math.random() * 10);
    }
    return tin;
}

module.exports = generateTin;