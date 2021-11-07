const crypto = require("crypto");
const fs = require("fs");
const Transaction = require('./transaction.js')
class Wallet {
    constructor() {
        this.balance = 1;
        this.binded = false;
        try {
            this.publicKey = fs.readFileSync("./public.pem", { encoding: "utf8" });
            this.privateKey = fs.readFileSync("./private.pem", { encoding: "utf8" });
        } catch(error){
            const keys = crypto.generateKeyPairSync("rsa", {
                modulusLength: 2048,
                publicKeyEncoding: { type: "spki", format: "pem" },
                privateKeyEncoding: { type: "pkcs8", format: "pem" },
              });
              this.privateKey = keys.privateKey;
              this.publicKey = keys.publicKey;
              fs.writeFileSync("./public.pem", Buffer.from(this.publicKey));
              fs.writeFileSync("./private.pem", Buffer.from(this.privateKey));
        }
    }
    bindChain(Chain){
        this.Chain = Chain;
        this.balance = this.Chain.instance.accountManager.getBalance(this.publicKey)
        this.binded = true;
    }
    send(amount, recieverPublicKey) {
        if(!this.binded) return;
        this.balance = this.Chain.instance.accountManager.getBalance(this.publicKey)
        if(amount < this.balance){
        const transaction = new Transaction(
          amount,
          this.publicKey,
          recieverPublicKey
        );
        const shaSign = crypto.createSign("SHA256");
        shaSign.update(transaction.toString()).end();
        const signature = shaSign.sign(this.privateKey);
        this.Chain.instance.insertBlock(transaction, this.publicKey, signature);
        }
    }
    get publickey(){
        return JSON.stringify(this.publicKey);
    }
    get Balance(){
        this.balance = this.Chain.instance.accountManager.getBalance(this.publicKey)
        return this.balance;
    }
    obtenerBlockPool(){
        if(!this.binded) return;
        return this.Chain.instance.blockpool;
    }
    minar(cantidad){
        if(!this.binded) return false;
        this.Chain.instance.minar(this.publicKey,cantidad);
        this.balance = this.Chain.instance.accountManager.getBalance(this.publicKey)
        return true;
    }
    obtenerBlockchain(){
        if(!this.binded) return;
        return this.Chain.instance;
    }
}
const wallet = new Wallet()
module.exports = wallet;
