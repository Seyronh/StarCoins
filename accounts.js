class AccountManager {
    constructor(){
        this.accounts = {"-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAulj3l6t5cJnSxqrAoS9o\nVMENXwObnd4fHCj4vh4a8OBA6bUn9gQTy7CGtLBW46Ul3ZahiaYSOm3AWNIkBc2h\nLimzlZluQDG+pzpUUcnWq1OroBGaT/+82CKxQK8ho0q5O0E3tAAcYSw+570RkPgI\nC4JmLI7/Sr8f1rQOEcWYuRSzgcC8coq0FDv81P4FDNsCHlMYl7m5zBr1zqYsDLit\nH6J8259yKc11X0vv6uuoDlKMhgGwsvOEg0I0wFLC7ojMwY5xzc3LaX7j3EuzwnYx\n2PZ+n+he8iGbwQ52mBUF9rzuhuVDeeVz3R51r8bkjx1bqzz+1Mm1OyqALiW+muVd\nxwIDAQAB\n-----END PUBLIC KEY-----\n":1000}
    }
    crearcuenta(publicKey){
        if(publicKey  !== undefined){
            this.accounts[publicKey] = 0;
        }
    }
    tienecuenta(publicKey){
        if(this.accounts[publicKey] == undefined){
            this.crearcuenta(publicKey)
        }
    }
    increment(publicKey,cantidad){
        this.tienecuenta(publicKey)
        this.accounts[publicKey] += cantidad;
    }
    decrement(publicKey,cantidad){
        this.tienecuenta(publicKey)
        this.accounts[publicKey] -= cantidad;
    }
    getBalance(publicKey){
        this.tienecuenta(publicKey)
        return this.accounts[publicKey];
    }
}
module.exports = AccountManager;