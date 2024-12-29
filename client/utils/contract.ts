import { chain } from "@/app/chain"
import { client } from "@/app/client"
import { getContract } from "thirdweb"
import { contractABI } from "./contractABI"

const contractAddress="0x8deBb06B80d688DC75F2417c4dD76545fbdfdbCe"

export const contract=getContract({
    client:client,
    chain:chain,
    address:contractAddress,
    abi:contractABI,
})