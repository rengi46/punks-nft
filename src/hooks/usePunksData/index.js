import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import usePlatziPunks from "../usePlatziPunks/usePlatziPunks";

const getPunkData = async ({platziPunks,tokenId}) => {
    const [
        tokenURI,
        tokenDNA,
        ownerOf,
        accessoriesType,
        clotheColor,
        clotheType,
        eyeType,
        eyeBrowType,
        facialHairColor,
        facialHairType,
        hairColor,
        hatColor,
        graphicType,
        mouthType,
        skinColor,
        topType
    ] = await Promise.all([
        platziPunks.methods.tokenURI(tokenId).call(),
        platziPunks.methods.tokenDNA(tokenId).call(),
        platziPunks.methods.ownerOf(tokenId).call(),
        platziPunks.methods.getAccessoriesType(tokenId).call(),
        platziPunks.methods.getClotheColor(tokenId).call(),
        platziPunks.methods.getClotheType(tokenId).call(),
        platziPunks.methods.getEyeType(tokenId).call(),
        platziPunks.methods.getEyeBrowType(tokenId).call(),
        platziPunks.methods.getFacialHairColor(tokenId).call(),
        platziPunks.methods.getFacialHairType(tokenId).call(),
        platziPunks.methods.getHairColor(tokenId).call(),
        platziPunks.methods.getHatColor(tokenId).call(),
        platziPunks.methods.getGraphicType(tokenId).call(),
        platziPunks.methods.getMouthType(tokenId).call(),
        platziPunks.methods.getSkinColor(tokenId).call(),
        platziPunks.methods.getTopType(tokenId).call(),
    ]);

    const responseMetadata = await fetch(tokenURI)
    const metadata = await responseMetadata.json();
    return {
        tokenId,
        attributes: {
            accessoriesType,
            clotheColor,
            clotheType,
            eyeType,
            eyeBrowType,
            facialHairColor,
            facialHairType,
            hairColor,
            hatColor,
            graphicType,
            mouthType,
            skinColor,
            topType
        },
        tokenURI,
        dna: tokenDNA,
        owner: ownerOf,
        ...metadata
    }
}


const usePlatziPunksData = ({owner = null}={}) => {
    const [punks, setPunks] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const platziPunks = usePlatziPunks();
    const {library} = useWeb3React();

    const update = useCallback(async () => {
        if (platziPunks) {
            setIsLoading(true);
            const isAddress = library.utils.isAddress(owner);
            let tokensId
            if(!isAddress) {
                const totalSupply = await platziPunks.methods.totalSupply().call();
                tokensId = new Array(Number(totalSupply)).fill().map((_, index) => index);
            }else{
                const balanceOf = await platziPunks.methods.balanceOf(owner).call();
                const tokensIdByOwner = new Array(Number(tokensId)).fill().map((_, index) => platziPunks.methods.tokenOfOwnerByIndex(owner,index).call());
                tokensId = await Promise.all(tokensIdByOwner);
            }
            const punksPromise = tokensId.map((tokenId) => {
                return getPunkData({ platziPunks , tokenId });
            })
            const punks = await Promise.all(punksPromise);
            setPunks(punks);
            setIsLoading(false);
        }
    } , [platziPunks]);

    useEffect(() => {
        update();
    }
    , [update]);

    return {
        isLoading,
        punks,
        update
    }
}


const usePlatziPunkData = (tokenId = null) => {
    const [punk, setPunk] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const platziPunks = usePlatziPunks();

    const update = useCallback(async () => {
        if (platziPunks && tokenId !== null) {
            setIsLoading(true);      
            const toSet = await getPunkData({ platziPunks , tokenId });
            console.log(toSet);
            setPunk(toSet);
            setIsLoading(false);
        }
    } , [platziPunks, tokenId]);

    useEffect(() => {
        update();
    }
    , [update]);

    return {
        isLoading,
        punk,
        update
    }
}


export { usePlatziPunksData ,usePlatziPunkData };