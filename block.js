const crypto = require("crypto");

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

class Block {
    constructor(previousHash,accounts,transaction, timestamp = Date.now()) {
      this.previousHash = previousHash;
      this.transaction = transaction;
      this.timestamp = timestamp;
      this.accounts = accounts;
      this.nonce = 0;
      this.difficulty = random(2,2)
    }
    getHash() {
        const json = JSON.stringify(this);
        const hash = crypto.createHash("SHA256");
        hash.update(json).end();
        const hex = hash.digest("hex");
        return hex;
      }
    toString() {
        return JSON.stringify(this);
    }
    static from(info){
      let blocke = new Block()
      blocke.previousHash = info.previousHash
      blocke.transaction = info.transaction
      blocke.timestamp = info.timestamp
      blocke.accounts = info.accounts
      blocke.nonce = info.nonce
      blocke.difficulty = info.difficulty
      return 
    }
}
module.exports = Block;