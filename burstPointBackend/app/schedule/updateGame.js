module.exports = {
    schedule: {
      interval: '20s', // 1 分钟间隔
      type: 'worker', // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
        //var time = new Date();
        //await ctx.app.redis.set('nowgame', time.toString())
        const re  = await ctx.service.mysql.getGameInfo()
        const nowBlock = await ctx.service.web3.getBlockNum()
        let startGameBlock = 0
        let handleEndBlock = 0
        let first = 0
        for(let i = 0; i < re.length; i++){
            if(re[i].isend == 0){
                if(first == 0){
                    handleEndBlock = re[i].gameid
                    first = 1
                }
                if(nowBlock - re[i].gameid - 10 < (re[i].burstvalue - 100)/ 10){
                    await ctx.app.redis.set('nowgame', re[i].gameid)
                    startGameBlock = parseInt(re[i].gameid)
                    break
                }
            }
        }
        do{
            if(startGameBlock == 0){
                await ctx.service.web3.startGame(nowBlock, 100 + Math.floor(Math.random()*900), 'test')
                break
            }
            const game = await ctx.service.mysql.getGame(handleEndBlock)
            if(game && game.length == 1){
                if(nowBlock - handleEndBlock > 110){
                    console.log('end left', nowBlock - handleEndBlock )
                    await ctx.service.web3.closeGame(handleEndBlock, game[0].burstvalue, game[0].password)
                }
                const records = await ctx.service.web3.getGameRecord(handleEndBlock)
                const addressList = records[0]
                const objectList = records[1]
                if(!addressList || !objectList){
                    break
                }
                for(let i = 0; i< addressList.length; i++){
                    const isExist = await ctx.service.mysql.getSingleBetInfo(handleEndBlock, addressList[i])
                    console.log('isExist', isExist.length)
                    let bv = objectList[i].burstValue
                    if(objectList[i].status == 2){
                        bv = 100 + (objectList[i].escapeBlockNum - handleEndBlock) * 10
                    }
                    if(isExist.length == 1){
                        let success = 0
                        if(nowBlock - handleEndBlock > 110 && bv < game[0].burstvalue){
                            success = 1
                        }
                        await ctx.service.mysql.updateBetInfo(
                            handleEndBlock, addressList[i], bv, objectList[i].betAmount, success
                        )
                    }
                    else{
                        await ctx.service.mysql.insertBetInfo(
                            handleEndBlock, addressList[i], bv, objectList[i].betAmount, 0
                        )
                    }
                }
                
            }
        }while(false)
        
        console.log(re)
        console.log('subscribe')
    },
  };