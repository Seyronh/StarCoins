const fs = require('fs');
const block = require('./block.js')

class saveloadSystem {
    constructor (){
        this.load()
    }
    load(){
        try {
            this.file = fs.readFileSync("./save.json", { encoding: "utf8" });
        } catch(error){
                const defaultjson = {
                    "iniated":false,
                    "blockpool":[],
                    "chain":[],
                    "accounts":{}
                }            
                fs.writeFileSync("./save.json", JSON.stringify(defaultjson));
            this.file = fs.readFileSync("./save.json", { encoding: "utf8" });
        }
        let parsed = JSON.parse(this.file)
        parsed.blockpool = parsed.blockpool.map(blockk => {
            return block.from(blockk)
        })
        parsed.chain = parsed.chain.map(blockk => {
            return block.from(blockk)
        })
        return parsed
    }
    save(blockpool,chain,accounts){
        const newjson = {
            "iniated":true,
            "blockpool":blockpool,
            "chain":chain,
            "accounts":accounts
        }
        fs.writeFileSync("./save.json", JSON.stringify(newjson));          
    }
}
const saveloadsystem = new saveloadSystem()
module.exports = saveloadsystem;