import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { darken, lighten } from 'polished'
import React, { useMemo , useEffect} from 'react'
import { Activity } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { InjectedConnector } from '@web3-react/injected-connector'
import ReactGA from 'react-ga'
import {injected, network} from '../../connectors'
import {SUPPORTED_WALLETS} from '../../constants'
import {showAddress} from '../../utils/fixFloat'
import { ChainId, TokenAmount, Currency } from '@liuxingfeiyu/zoo-sdk'
import { useActiveWeb3React, useEagerConnect } from '../../hooks'


const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.FANTOM]: 'Fantom',
  [ChainId.FANTOM_TESTNET]: 'Fantom Testnet',
  [ChainId.MATIC]: 'Matic',
  [ChainId.MATIC_TESTNET]: 'Matic Testnet',
  [ChainId.XDAI]: 'xDai',
  [ChainId.BSC]: 'BSC',
  [ChainId.BSC_TESTNET]: 'BSC Testnet',
  [ChainId.OKCHAIN_TEST]: 'OKExChain Testnet',
  [ChainId.OKCHAIN]: 'OKChain',
  [ChainId.MOONBASE]: 'Moonbase',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.FUJI]: 'Fuji',
  [ChainId.HECO]: 'HECO',
  [ChainId.HECO_TESTNET]: 'HECO Testnet',
  [ChainId.OASISETH_TEST]: 'Emerald Testnet',
  [ChainId.OASISETH_MAIN]: 'Emerald mainnet'
}

export default function Web3Status() {
  const { active, connector, activate, error } = useWeb3React()
  console.log(active)
  const tryActivation = async (connector: AbstractConnector | undefined) => {
    console.log("here active")
    if(connector){
      console.log("here active1")
      activate(connector, undefined, true).catch(error => {
        console.log(error)
        if (error instanceof UnsupportedChainIdError) {
            activate(connector) // a little janky...can't use setError because the connector isn't set
        } 
      })
    }        
  }
  const triedEager = useEagerConnect()

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !active && !error && !active) {
      activate(network)
    }
  }, [triedEager, active, error, activate, active])
  const connect = async () => {
    console.log('Connecting to MetaMask...')
    try {
        await activate(injected).then(() => {
        })
    } catch(error) {
        console.log('Error on connecting: ', error)
    }
  }
  const { account, chainId } = useActiveWeb3React()

  return (
    <>
      {
        account?
        <div style={{display: 'flex'}}> 
          <div
            className="header-button"
            style={{marginRight:'10px'}}
          >
            {NETWORK_LABELS[chainId ?? 1]}
          </div>
          <div className="header-button">
            {
            showAddress(account)
            }
          </div>
        </div>
        :
        <div
          className="header-button"
          style={{position : 'relative', cursor:'pointer'}}
          onClick={()=>{tryActivation(SUPPORTED_WALLETS.METAMASK.connector)}} 
        > 
        connect to wallet
        </div>
        }
      
    </>
  )
}
