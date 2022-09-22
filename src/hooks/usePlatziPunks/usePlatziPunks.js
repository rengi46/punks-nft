import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import {platzyPunkArtifacts} from '../../config/web3/artifacs/platziPunks';
const {abi, address} = platzyPunkArtifacts

const usePlatziPunks = () => {
    const { activate,library, chainId } = useWeb3React();

    const contract = useMemo(() => {

        if (activate && library) {
            return new library.eth.Contract(abi, address[chainId]);
        }
    }, [activate,chainId, library?.eth?.Contract]);
    return contract
}

export default usePlatziPunks;