const Wallet = require("./wallet.js")
const Chain = require('./blockchain.js')
Wallet.bindChain(Chain)
module.exports = Wallet;