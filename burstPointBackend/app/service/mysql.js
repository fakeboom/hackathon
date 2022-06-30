const { Service } = require('egg');

class MysqlService extends Service {
    async insertGameInfo(gameid, burstValue, password, isend){
        try {
            const result = await this.app.mysql.insert('gameinfo', 
            { gameid: gameid ,
              burstvalue: burstValue,
              password: password,
              isend: isend
            });
            console.log(result)
        } catch (err) {
           if (err.code === 'ER_DUP_ENTRY') {
               //handleHttpErrors(SYSTEM_ERRORS.USER_ALREADY_EXISTS);
           } else {
               //handleHttpErrors(err.message);
            }
        }
        
    }
    async insertBetInfo(gameid, address, burstValue, amount, success){
        try {
            const result = await this.app.mysql.insert('betinfo',
                {
                    gameid: gameid,
                    address: address,
                    burstvalue: burstValue,
                    amount: amount,
                    success: success,
                }
            )
            console.log(result)
        } catch (err) {
            console.error(err)
           if (err.code === 'ER_DUP_ENTRY') {
               //handleHttpErrors(SYSTEM_ERRORS.USER_ALREADY_EXISTS);
           } else {
               //handleHttpErrors(err.message);
            }
        }
    }

    async getBetInfo(){
        const result = await this.app.mysql.select('betinfo',
        {
            orders:[
                ['gameid', 'DESC']
            ]
        }
        )
        return result
    }

    async getBetInfoByAddress(address){
        const result = await this.app.mysql.select('betinfo',
        {
            where:{
                address : address
            },
            orders:[
                ['gameid', 'DESC']
            ]
        }
        )
        return result
    }

    async getBetInfoByGame(gameid){
        const result = await this.app.mysql.select('betinfo',
        {
            where:{
                gameid : gameid
            }
        }
        )
        return result
    }

    async getSingleBetInfo(gameid, address){
        const result = await this.app.mysql.select('betinfo',
        {
            where:{
                gameid: gameid,
                address: address
            }
        }
        )
        return result
    }

    async updateBetInfo(gameid, address, burstValue, amount, success){
        await this.app.mysql.update('betinfo',
            {
                burstvalue: burstValue,
                amount: amount,
                success: success,
            },
            {
                where:{
                    gameid: gameid,
                    address: address,
                }
            }
        )
    }

    async updateBetHash(gameid, hash){
        await this.app.mysql.update('betinfo',
            {
                endhash: hash
            },
            {
                where:{
                    gameid: gameid,
                }
            }
        )
    }

    async getGameInfo(){
        const result = await this.app.mysql.select('gameinfo',
            {
                where:{
                    isend: 0
                },
                orders:[
                    ['gameid', 'ASC']
                ]
            }
        )
        return result
    }

    async getGame(id){
        const result = await this.app.mysql.select('gameinfo',
            {
                where:{
                    gameid: id
                }
            }
        )
        return result
    }

    async endGame(id, hash){
        await this.app.mysql.update(
            'gameinfo',
            {
                isend: '1',
                endhash: hash
            },
            {
                where:{
                    gameid: id
                }
            }
        )
    }
}

module.exports = MysqlService