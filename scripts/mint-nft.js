//step 1: You define your variables from .env file
require('dotenv').config();
const { API_URL, API_URL_MATIC, PRIVATE_KEY, PUBLIC_KEY, CONTRACT_ADDRESS } = process.env;

if (CONTRACT_ADDRESS === undefined) {
  throw new Error("CONTRACT_ADDRESS is empty!")
}

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL_MATIC);

//step 2: Define our contract ABI (Application Binary Interface) & adresses
const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
const contractAddress = CONTRACT_ADDRESS;
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

//step 3: Define the minting function
async function mintNFT(tokenURI) {
  console.log(`Minting: ${tokenURI}`)
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce

  const estimatedGas = await web3.eth.estimateGas({
     "from"      : PUBLIC_KEY,       
     "nonce"     : nonce, 
     "to"        : contractAddress,     
     "data"      : nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
  });

  //the transaction
  const tx = {
    'from': PUBLIC_KEY,
    'to': contractAddress,
    'nonce': nonce,
    'gas': estimatedGas + 10,
    'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
  };

  //step 4: Sign the transaction
  const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  
  console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
}

async function main() {
  //step 5: Call the mintNFT function
  for (let i = 0; i < 30; i++) {
    let num = ('000' + (i + 1)).slice(-4);
    await mintNFT(`https://data.henrychao.me/painting_nft/metadata/${num}.json`);
  }
}

main()
