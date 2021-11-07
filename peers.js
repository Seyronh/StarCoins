var swarm = require('webrtc-swarm')
var signalhub = require('signalhub')
const EventEmitter = require('events')
const Chain = require('./blockchain.js')
class PeerManager extends EventEmitter {
    constructor(){
        super()
        this.hub = signalhub('starcoins', ['https://StarCoins.seyron.repl.co'])
        this.sw = swarm(this.hub, {
            wrtc: require('wrtc')
        })
        this.listen()
    }
    listen(){
        this.sw.on('peer', function (peer, id) {
            if(Chain.instance.log){
                console.log("Nuevo peer conectado",id)
            }
            this.emit('Nuevopeer',id)
            peer.on('data', data => {
                this.recibirDatos(data)
            })
        })
    }
    enviarCadena(Chain){
        if(Chain.instance.log){
            console.log("Cadena enviada")
        }
        this.sw.peers.forEach(peer => {
            peer.send(Buffer.from(JSON.stringify({type:1,content:Chain})))
        })
        return true;
    }
    enviarBlockpool(blockpool){
        if(Chain.instance.log){
            console.log("Blockpool enviada")
        }
        this.sw.peers.forEach(peer => {
            peer.send(Buffer.from(JSON.stringify({type:2,content:blockpool})))
        })
        return true;
    }
    recibirDatos(Datos){
        let datos = JSON.parse(Datos.toString());
        if(datos.type == 1){
            if(Chain.instance.log){
                console.log("Cadena recibida")
            }
            this.emit('NuevaCadena',datos.content)
        }
        if(datos.type == 2){
            if(Chain.instance.log){
                console.log("Blockpool recibida")
            }
            this.emit('NuevaBlockpool',datos.content)
        }
    }
}
module.exports = PeerManager;
