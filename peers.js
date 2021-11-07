var swarm = require('webrtc-swarm')
var signalhub = require('signalhub')
const EventEmitter = require('events')

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
            peer.on('data', data => {
                this.recibirDatos(data)
            })
        })
    }
    enviarCadena(Chain){
        this.sw.peers.forEach(peer => {
            peer.send(Buffer.from(JSON.stringify({type:1,content:Chain})))
        })
        return true;
    }
    enviarBlockpool(blockpool){
        this.sw.peers.forEach(peer => {
            peer.send(Buffer.from(JSON.stringify({type:2,content:blockpool})))
        })
        return true;
    }
    recibirDatos(Datos){
        let datos = JSON.parse(Datos.toString());
        if(datos.type == 1){
            this.emit('NuevaCadena',datos.content)
        }
        if(datos.type == 2){
            this.emit('NuevaBlockpool',datos.content)
        }
    }
}
module.exports = PeerManager;