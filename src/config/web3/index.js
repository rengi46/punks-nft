import Web3 from 'web3';
import { InjectedConnector } from '@web3-react/injected-connector';

export const connector = new InjectedConnector({
    supportedChainIds: [4],
    // isMetaMask: true,
    // isTrust: true,
});



export const web3Rinkeby = new Web3("https://rinkeby.infura.io/v3/3fbe2fcdf00c4e7abb9d9cd62ae1bcf1");

export const getLibrary = (provider) => {
    return new Web3(provider);
    }