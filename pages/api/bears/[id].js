import Cors from "cors";
import LosBearsAbi from "../../../contract/abis/LosBears.json";
import { ethers } from "ethers";

export default async function handler(req, res) {
  try {
    // Ignore .json extension
    const id = req.query.id.replace(/\D+/g, "");

    await Cors(req, res);

    // Web3 stuff

    const web3 = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_NETWORK_RPC
    );
    // Loading LosBears abi
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      LosBearsAbi,
      web3
    );

    // Check if bear has owner
    contract
      .ownerOf(id)
      .then(() => {
        // Fetch the bear metadata
        fetch(`${process.env.METADATA_URL}/${id}.json`)
          .then((response) => response.json())
          .then((metadata) => {
            res.status(200).json(metadata);
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      })
      .catch(() => {
        res.status(404).json({
          message: "Bear not found yet",
        });
      });
  } catch (error) {
    res.status(500).json({ error });
  }
}
