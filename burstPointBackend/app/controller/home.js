'use strict';
const ABI = require('../abi/burstPoint.json')
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx , service, config} = this;
    ctx.body = await service.web3.getBlockNum();
    ctx.body += '\n'
    ctx.body += service.web3.getStartSha256(300, 'test')
    ctx.body += '\n'
    console.log(config.adminAddress)
    ctx.body += await service.web3.getBalance(config.adminAddress)

    const qr = await service.mysql.getGameInfo()
    console.log(qr)

    await this.service.mysql.updateBetHash(1845832, "123")
    
  }
  
  async contractBalance(){
    const { ctx , service, config} = this;
    const balance = await service.web3.getBalance(config.contractAddress)
    console.log(balance)
    ctx.body = balance
  }

  async adminAdd(){
    const { ctx , service, config} = this;
    await service.web3.addToContract(1)
  }


  async getRecord(){
    const { ctx , service, config} = this;
    const re = await service.mysql.getBetInfo()
    ctx.body = {
      code: 0,
      data: re
    }
  }

  async getMyRecord(){
    const { ctx , service, config} = this;
    const {address} = ctx.params
    const re = await service.mysql.getBetInfoByAddress(address)
    ctx.body = {
      code: 0,
      data: re
    }
  }

  async getGameStatus(){
    const { ctx , service, config} = this;
    const nowgame = await this.app.redis.get('nowgame')
    ctx.body = {
      code: 0,
      data: nowgame
    }
  }


}

module.exports = HomeController;
