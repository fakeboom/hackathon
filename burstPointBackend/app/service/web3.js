const { Service } = require('egg');
const Web3 = require("web3")
const { ethers } = require("ethers");
const cryptoJs = require("crypto-js")
const base64 = require('crypto-js/enc-base64')
const ABI = require('../abi/burstPoint.json')
const Tx = require('ethereumjs-tx').Transaction

class Web3Service extends Service {
  async getBlockNum() {
    const web3 = new Web3(this.config.web3Url)
    const latestBlockNumber = await web3.eth.getBlockNumber()
    return latestBlockNumber
  }

  getStartSha256( burstValue, passWord ){
    const web3 = new Web3(this.config.web3Url)
    const re = web3.eth.abi.encodeParameters(['string'], [burstValue.toString() + passWord]);
    return ethers.utils.sha256(re)
  }

  async getBalance(address){
    const web3 = new Web3(this.config.web3Url)
    const wei = await web3.eth.getBalance(address)
    const balance = web3.utils.fromWei(wei, 'ether')
    return balance
  } 

  async getSignedtxString(value, data){
    const web3 = new Web3(this.config.web3Url)
    const count = await web3.eth.getTransactionCount(this.config.adminAddress)
    const accountNonce = '0x' + ( count).toString(16)
    const rawTx =
    {
        nonce: accountNonce,
        from: this.config.adminAddress,
        to: this.config.contractAddress,
        gasPrice: web3.utils.toHex(100001000000),
        gasLimit: web3.utils.toHex(2000000),
        value: value,
        data: data
    };
    const account = await web3.eth.accounts.privateKeyToAccount(this.config.primaryKey)

    const signedTx = await account.signTransaction(rawTx)
    return signedTx
  }

  async addToContract(amount){
    const web3 = new Web3(this.config.web3Url)
    const contract = new web3.eth.Contract(ABI, this.config.contractAddress)
    var serializedTx = await this.getSignedtxString(
        web3.utils.toHex(web3.utils.toWei(amount.toString(), 'ether')),
        contract.methods.ownerAdd().encodeABI()
        )
    web3.eth.sendSignedTransaction(serializedTx.rawTransaction)
    .on('transactionHash',(hash)=>{
        console.log('txHash:', hash)
    }
    )
    .on('receipt',(receipt)=>{
        //console.log('receipt', receipt)
    }
    )
    .on('error', console.error)


    console.log(serializedTx)
    /*const func = */ //await contract.methods.ownerAdd().send({from:this.config.adminAddress, value: web3.utils.toWei(amount.toString(), 'ether'), gas: 21000})
    //web3.eth.accounts.signTransaction(func, this.config.primaryKey);
    //func
  }

  async startGame(blockNum, burstValue, password){
    const web3 = new Web3(this.config.web3Url)
    const contract = new web3.eth.Contract(ABI, this.config.contractAddress)
    const hash = this.getStartSha256(burstValue, password)
    var serializedTx = await this.getSignedtxString(
        web3.utils.toHex(0),
        contract.methods.beginGame(blockNum, hash).encodeABI()
        )
    web3.eth.sendSignedTransaction(serializedTx.rawTransaction)
    .on('transactionHash',(hash)=>{
        console.log('txHash:', hash)
    }
    )
    .on('receipt',(receipt)=>{
        console.log('startGame success' , blockNum)
        this.service.mysql.insertGameInfo(blockNum, burstValue, password,  0)
    }
    )
    .on('error', (error)=>{
        console.log('startGame error', error)
    })
  }

  async closeGame(blockNum, burstValue, password){
    const web3 = new Web3(this.config.web3Url)
    const contract = new web3.eth.Contract(ABI, this.config.contractAddress)
    var serializedTx = await this.getSignedtxString(
        web3.utils.toHex(0),
        contract.methods.closeGame(blockNum, burstValue, password).encodeABI()
        )
    await web3.eth.sendSignedTransaction(serializedTx.rawTransaction)
    .on('transactionHash',(hash)=>{
        console.log('txHash:', hash)
    }
    )
    .on('receipt',(receipt)=>{
        console.log('closeGame success' , blockNum)
        this.service.mysql.endGame(blockNum, receipt.transactionHash)
        this.service.mysql.updateBetHash(blockNum, receipt.transactionHash)
    }
    )
    .on('error', (error)=>{
        console.log('closeGame error', error)
    })
  }

  async getGameRecord(blockNum){
    const web3 = new Web3(this.config.web3Url)
    const contract = new web3.eth.Contract(ABI, this.config.contractAddress)
    const re  = await contract.methods.getGameRecords(blockNum).call()
    return re
  }


}

module.exports = Web3Service;