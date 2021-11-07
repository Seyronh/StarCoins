Una cryptomoneda que no tiene valor de mercado pero funciona como tal.
![Creador](https://raster.shields.io/static/v1?label=Creador&message=Seyron#5532&color=RED?style=flat&logo=appveyor)

## Instalación
Antes de instalarlo, debe tener instalado [Node.js](https://nodejs.org/en/download/)
La instalación se realiza mediante el [comando de instalación npm](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install starcoins --save
```
## IMPORTANTE
El npm al usarlo creara dos archivos public.pem y private.pem es importante que no comparta el contenido de private.pem y que no borre ninguno de los archivos ya que son los identificadores de su cartera donde se guardan las cryptos

## Metodos
### send
Con este metodo se hacen las transacciones de safecoins toma de argumentos (cantidad,clavepublica) la clavepublica debe ser la de la persona a la que le mandara el dinero

### obtenerBlockpool
Con este metodo se obtiene la blockpool(esto es usado por los mineros de bloques) blockpool es la lista de bloques que aun no han sido verificados por los mineros osea transacciones pendientes

### minar
Con este metodo usaras recursos del dispositivo donde ejecutes el npm para verificar los bloques en la blockpool el primero en verificar todos los bloques se lleva el premio de X/2 bloques en monedas

### obtenerBlockchain
Con este metodo obtendras la blockchain

## Ejemplos

### Ejemplo 1: Ver balance de tu cuenta
```js
const cartera = require('safecoins')
console.log(cartera.Balance) //Esto mostrara el balance que tienes de safecoins (en un principio son 0)
```
### Ejemplo 2: Ver tu publickey
```js
const cartera = require('safecoins')
console.log(cartera.publickey) //Esto mostrara tu publickey para copiar y que alguien la use para mandarte safecoins
```
### Ejemplo 3: Enviar safecoins
```js
const cartera = require('safecoins')
let cantidad = 2; //La cantidad de safecoins a mandar(mayor que 0.5 ya que esta es la comision por realizar una transaccion)
let clavedestino = "clavedestino";//Aqui se pondra la clave de destino a la que se enviaran los safecoins
cartera.send(cantidad,clavedestino)
```
### Ejemplo 4: Minar bloques
```js
const cartera = require('safecoins')
cartera.minar() //Minara todos los bloques de la blockpool si eres capaz de hacerlo antes que otra persona te llevaras la recompensa de safecoins (cada bloque son 0.5 safecoins)
```
