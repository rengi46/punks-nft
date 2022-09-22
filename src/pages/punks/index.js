import React, { useState } from 'react'
import {
  Grid,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Button,
  FormHelperText,
  FormControl,
  useToast,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import {useWeb3React} from '@web3-react/core'
import Loading from '../../components/loading'
import PunkCard from '../../components/punk-card'
import RequestAccess from '../../components/request-acces'
import { usePlatziPunksData } from '../../hooks/usePunksData'
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";


const Punks = () => {
    const toast = useToast();
    let navigate = useNavigate();
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const foo = params.get('address');
    console.log(foo);

    const { active, activate, library, chainId } = useWeb3React();
    const [submited, setSubmited] = useState(false);
    
    const {isLoading , punks } = usePlatziPunksData({owner:submited ? address:null})

    const [address, setAddress] = useState(foo || '');


    const submit = async (e) => {
        e.preventDefault();
        const isAddress = await library.utils.isAddress(address);
        if(!isAddress) {
            toast({
                title: "Invalid address",
                description: "Please enter a valid address",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            return;
        }else{
          navigate(`/punks?address=${address}`);
          setSubmited(true);
        }
    }

    const handleAddressChange = ({ target: { value } }) => {
      setAddress(value);
    };

    if(!active) return <RequestAccess />

  return (
    <>
    <form onSubmit={submit}>
        <FormControl>
          <InputGroup mb={3}>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              isInvalid={false}
              value={address}
              onChange={handleAddressChange}
              placeholder="Buscar por dirección"
            />
            <InputRightElement width="5.5rem">
              <Button type="submit" h="1.75rem" size="sm">
                Buscar
              </Button>
            </InputRightElement>
          </InputGroup>
          {/* {submitted && !validAddress && (
            <FormHelperText>Dirección inválida</FormHelperText>
          )} */}
        </FormControl>
      </form>
      {isLoading?
      <Loading />
      :
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
        {punks.map(punk => (
          <Link key={punk.tokenId} to={`/punks/${punk.tokenId}`}>
            <PunkCard key={punk.tokenId} image={punk.image} name={punk.name}/>
          </Link>
        ))}
      </Grid>
      }
    </>
  )
}

export default Punks;