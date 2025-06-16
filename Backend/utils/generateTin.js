function generateTin() {
    return Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
}

module.exports = generateTin;