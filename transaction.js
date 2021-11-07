class Transaction {
    constructor(amount, senderPublicKey, recieverPublicKey) {
      this.amount = amount;
      this.senderPublicKey = senderPublicKey;
      this.recieverPublicKey = recieverPublicKey;
    }
    toString() {
        return JSON.stringify(this);
      }
}
module.exports = Transaction;