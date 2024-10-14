import { useState } from "react";
import { ethers } from "ethers";
import MessageStorage from "../artifacts/contracts/MessageStorage.sol/MessageStorage.json";

const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your deployed contract address

export default function Home() {
  const [message, setMessage] = useState("");
  const [inputValue, setInputValue] = useState("");

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_INFURA_URL
  );
  const signer = provider.getSigner();

  const contract = new ethers.Contract(
    contractAddress,
    MessageStorage.abi,
    signer
  );

  const handleSetMessage = async () => {
    const tx = await contract.setMessage(inputValue);
    await tx.wait();
    alert("Message set!");
  };

  const handleGetMessage = async () => {
    const msg = await contract.getMessage();
    setMessage(msg);
  };

  return (
    <div>
      <h1>Web3 Message Storage</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter a message"
      />
      <button onClick={handleSetMessage}>Set Message</button>
      <button onClick={handleGetMessage}>Get Message</button>
      {message && <p>Stored Message: {message}</p>}
    </div>
  );
}
