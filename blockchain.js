const crypto = require("crypto");
const Block = require('./block.js')
const Transaction = require('./transaction.js')
const accountManager = require('./accounts.js')
const PeerManager = require('./peers.js')
const peermanager = new PeerManager()
const saveloadsystem = require('./save-load.js')
class Chain {
    static instance = new Chain();
    constructor() {
      this.accountManager = new accountManager();
      this.blockpool = [];
      this.chain = [new Block("",this.accountManager.accounts,new Transaction(100, "temp", "temp"))];
      this.log = false;
      this.savedinfo = saveloadsystem.load()
      if(this.savedinfo.iniated){
        this.accountManager.accounts = this.savedinfo.accounts
        this.blockpool = this.savedinfo.blockpool
        this.chain = this.savedinfo.chain
      } else {
        saveloadsystem.save(this.blockpool,this.chain,this.accountManager.accounts)
      }
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
        saveloadsystem.save(this.blockpool,this.chain,this.accountManager.accounts)
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
            saveloadsystem.save(this.blockpool,this.chain,this.accountManager.accounts)
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
            if(blockchain[i-2].transaction.amount < 0.5 || blockchain[i-1].transaction.amount < 0.5 || blockchain[i].transaction.amount < 0.5){
              valida = false;
              break;
            }
        }
        return valida;
    }
    minar(publicKey){
      let blockss = this.blockpool
      const blocksslength = blockss.length
      if(blockss.length <= 0) return;
      let blockmined = []
      let pago = 0.5
      for(let i = 0;i<blocksslength;i++){
        blockss.push(new Block(this.getLastBlock().getHash(),this.accountManager.accounts, new Transaction(pago, "temp", publicKey)))
      }
      for(let i = 0;i<blockss.length;i++){
        let block = blockss[i]
        if(this.log){
          console.log(`Comenzado a minar el bloque: ${i+1}/${blockss.length} con dificultad: ${block.difficulty}`)
        }
        block.transaction.senderPublicKey = block.transaction.senderPublicKey.replace(/\\n/g,'\n')
        block.transaction.recieverPublicKey = block.transaction.recieverPublicKey.replace(/\\n/g,'\n')
        if(block.transaction.senderPublicKey !== 'temp'&&this.accountManager.getBalance(block.transaction.senderPublicKey)-block.transaction.amount<0){
          return;
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
        if(blockmined[0] !== undefined&&(blockss.length-1)!==i){
          blockss[i+1].previousHash = blockmined[blockmined.length-1].getHash()
        }
      }
      this.blockpool = []
      this.chain = this.chain.concat(blockmined);
      saveloadsystem.save(this.blockpool,this.chain,this.accountManager.accounts)
      peermanager.enviarCadena(this.chain);
      if(this.log){
        console.log(`Se ha completado el minado de ${blockss.length} bloques recompensa añadida y nueva cadena enviada`)
      }
    }
}
peermanager.on('NuevaCadena',cadena => {
  if(Chain.instance.log){
    console.log("BlockChain recibida")
  }
  Chain.instance.replaceblockchain(cadena);
});
peermanager.on('NuevaBlockpool',blockpool => {
  if(Chain.instance.log){
    console.log("Blockpool recibida")
  }
  Chain.instance.blockpool = blockpool;
  saveloadsystem.save(Chain.instance.blockpool,Chain.instance.chain,Chain.instance.accountManager.accounts)
});
peermanager.on('Nuevopeer',id => {
  if(Chain.instance.log){
    console.log("Nuevo peer conectado",id)
  }
  peermanager.enviarCadena(Chain.instance.chain)
  if(Chain.instance.log){
    console.log("Cadena enviada")
  }
  peermanager.enviarBlockpool(Chain.instance.blockpool)
  if(Chain.instance.log){
    console.log("Blockpool enviada")
  }
});
module.exports = Chain;
