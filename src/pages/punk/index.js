import {
    Stack,
    Heading,
    Text,
    Table,
    Thead,
    Tr,
    Th,
    Td,
    Tbody,
    Button,
    Tag,
    useToast,
  } from "@chakra-ui/react";
  import { useWeb3React } from "@web3-react/core";
  import RequestAccess from "../../components/request-acces";
  import PunkCard from "../../components/punk-card";
  import { usePlatziPunkData } from "../../hooks/usePunksData";
  import { useParams } from "react-router-dom";
  import Loading from "../../components/loading";
import { useState } from "react";
import usePlatziPunks from "../../hooks/usePlatziPunks/usePlatziPunks";
  
  
  
  const Punk = () => {
      const { active, account ,library } = useWeb3React();
      const { tokenId } = useParams();
      const { isLoading, punk ,update } = usePlatziPunkData(tokenId);
      const [transfering , setTransfering] = useState(false);
      const platziPunks = usePlatziPunks();
      const toast = useToast();
      
      const transfer = async () => {
        setTransfering(true);
        const address = prompt("Enter the address to transfer");
        const isAddress = await library.utils.isAddress(address);

        if(!isAddress) {
            toast({
                title: "Invalid address",
                description: "Please enter a valid address",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            setTransfering(false);
            return;
            
        }else{
            platziPunks.methods
                .safeTransferFrom(punk.owner, address, punk.tokenId)
                .send({from: account})
                .on("transactionHash", (hash) => {
                    toast({
                        title: "Transaction hash",
                        description: hash,
                        status: "info",
                        duration: 9000,
                        isClosable: true,
                    });
                }).on("receipt", (receipt) => {
                    toast({
                        title: "Receipt",
                        description: receipt,
                        status: "info",
                        duration: 9000,
                        isClosable: true,
                    });
                    setTransfering(false);
                    update();
                }).on("error", (error) => {
                    toast({
                        title: "Error",
                        description: error.message,
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                    setTransfering(false)
                })
        }

    }
  
    if (!active) return <RequestAccess />;
  
    if (isLoading) return <Loading />;

    console.log(punk.attributes);
  
    return (
      <Stack
        spacing={{ base: 8, md: 10 }}
        py={{ base: 5 }}
        direction={{ base: "column", md: "row" }}
      >
        <Stack>
          <PunkCard
            mx={{
              base: "auto",
              md: 0,
            }}
            name={punk.name}
            image={punk.image}
          />
          <Button
            onClick={transfer}
            disabled={account !== punk.owner} 
            isLoading={transfering}
            colorScheme="green">
            {account !== punk.owner ? "No eres el dueño" : "Transferir"}
          </Button>
        </Stack>
        <Stack width="100%" spacing={5}>
          <Heading>{punk.name}</Heading>
          <Text fontSize="xl">{punk.description}</Text>
          <Text fontWeight={600}>
            DNA:
            <Tag ml={2} colorScheme="green">
              {punk.dna}
            </Tag>
          </Text>
          <Text fontWeight={600}>
            Owner:
            <Tag ml={2} colorScheme="green">
              {punk.owner}
            </Tag>
          </Text>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>Atributo</Th>
                <Th>Valor</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(punk.attributes).map(([key, value]) => (
                <Tr key={key}>
                  <Td>{key}</Td>
                  <Td>
                    <Tag>{value}</Tag>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Stack>
      </Stack>
    );
  };
  
  export default Punk;