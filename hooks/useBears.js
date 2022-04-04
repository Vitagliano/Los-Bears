import { ethers } from "ethers";
import { useEffect, useState } from "react";
import LosBearsAbi from "../contract/abis/LosBears.json";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const useBears = (web3, account) => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (web3) {
      let c = new ethers.Contract(
        contractAddress,
        LosBearsAbi,
        web3.getSigner(account)
      );
      setContract(c);
    }
  }, [web3, account]);

  const getUserBears = async () => {
    if (account) {
      const tokens = [];
      let index = 0;
      const owner = account;
      const balance = await contract.balanceOf(owner);
      for (let i = 0; i < balance; i++) {
        const token = await contract.tokenOfOwnerByIndex(owner, index);
        tokens.push(token);
        index++;
      }

      return tokens;
    }
  };

  const getBearMetadata = async (BearId) => {
    const response = await fetch(`/api/Bears/${BearId}.json`);
    if (response.status === 200) {
      let data = await response.json();
      data = {
        ...data,
        id: BearId,
      };
      return data;
    } else if (BearId > 0 && response.status === 500) {
      return await getBearMetadata(BearId);
    }
    return null;
  };

  return {
    contract,
    getUserBears,
    getBearMetadata,
  };
};

export default useBears;
