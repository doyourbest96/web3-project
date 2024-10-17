import { useState } from "react";
import { ethers } from "ethers";
import MessageStorage from "../artifacts/contracts/MessageStorage.sol/MessageStorage.json";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function Home() {
  const [message, setMessage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
    if (!inputValue.trim()) {
      setError("Please enter a message");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const tx = await contract.setMessage(inputValue);
      await tx.wait();
      alert("Message set successfully!");
      setInputValue("");
    } catch (err) {
      setError("Failed to set message: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetMessage = async () => {
    setIsLoading(true);
    setError("");
    try {
      const msg = await contract.getMessage();
      setMessage(msg);
    } catch (err) {
      setError("Failed to get message: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Web3 Message Storage</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter a message"
        disabled={isLoading}
      />
      <button onClick={handleSetMessage} disabled={isLoading}>
        {isLoading ? "Setting..." : "Set Message"}
      </button>
      <button onClick={handleGetMessage} disabled={isLoading}>
        {isLoading ? "Getting..." : "Get Message"}
      </button>
      {message && <p>Stored Message: {message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
