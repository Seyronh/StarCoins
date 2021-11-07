const crypto = require("crypto");
const Block = require('./block.js')
const Transaction = require('./transaction.js')
const accountManager = require('./accounts.js')
const PeerManager = require('./peers.js')
const peermanager = new PeerManager()
class Chain {
    static instance = new Chain();
    constructor() {
      this.accountManager = new accountManager();
      this.blockpool = [];
      this.chain = [new Block("",this.accountManager.accounts,new Transaction(100, "temp", "temp"))];
      this.log = false;
    }
    getLastBlock(){
      return this.chain[this.chain.length - 1]
    }
    insertBlock(transaction, senderPublicKey, sig) {
      const verify = crypto.createVerify("SHA256");
      verify.update(transaction.toString());
      const isValid = verify.verify(senderPublicKey, sig);
      if (isValid) {
        if(this.log){
          console.log("Bloque Agregado a la lista de espera")
        }
        const block = new Block(this.getLastBlock().getHash(),this.accountManager.accounts, transaction);
        this.blockpool.push(block)
        peermanager.enviarBlockpool(this.blockpool);
      }
    }
    replaceblockchain(blockchain){
        if(this.log){
          console.log("Ha llegado una cadena nueva")
        }
        if(this.Verify(blockchain) && blockchain.length>this.chain.length){
          if(this.log){
            console.log("La cadena nueva era valida")
          }
            this.chain = blockchain;
            this.accountManager.accounts = this.chain[this.chain.length-1].accounts
            this.blockpool = this.chain[this.chain.length-1].blockpool
        }
    }
    static Verify(blockchain){
        let valida = true;
        for(let i = 2;i<blockchain.length;i++){
            if(blockchain[i-1].getHash() !== blockchain[i].previousHash){
                valida = false;
                break;
            }
            if(blockchain[i-2].getHash() !== blockchain[i-1].previousHash){
              valida = false;
              break;
            }
        }
        return valida;
    }
    minar(publicKey){
      let blockss = this.blockpool
      if(blockss.length <= 0) return;
      this.accountManager.increment(publicKey,blockss.length/2)
      blockss[blockss.length-1].accounts = this.accountManager.accounts;
      let blockmined = []
      for(let i = 0;i<blockss.length;i++){
        let block = blockss[i]
        if(this.log){
          console.log(`Comenzado a minar el bloque: ${i+1}/${blockss.length} con dificultad: ${block.difficulty}`)
        }
        this.accountManager.increment(block.transaction.recieverPublicKey,block.transaction.amount)
        this.accountManager.decrement(block.transaction.senderPublicKey,block.transaction.amount)
        block.accounts = this.accountManager.accounts;
        while(block.getHash().substring(0, block.difficulty) !==Array(2 + 1).join("0")){
          block.nonce++;
          if(this.log && block.nonce%1000==0){
            console.log(`el bloque: ${i+1}/${blockss.length} con dificultad: ${block.difficulty} esta siendo minado y ya lleva ${block.nonce} intentos`)
          }
        }
        if(this.log){
          console.log(`Terminado de minar el bloque: ${i+1}/${blockss.length} con dificultad: ${block.difficulty}`)
        }
        blockmined.push(block)
      }
      this.chain = this.chain.concat(blockmined);
      peermanager.enviarCadena(this.chain);
      if(this.log){
        console.log(`Se ha completado el minado de ${blockss.length} bloques recompensa añadida y nueva cadena enviada`)
      }
    }
}
peermanager.on('NuevaCadena',cadena => {
  Chain.instance.replaceblockchain(cadena);
});
peermanager.on('NuevaBlockpool',blockpool => {
  Chain.instance.blockpool = blockpool;
});
module.exports = Chain;
