import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { formatEther } from "ethers/lib/utils";
import { Link } from "react-router-dom";
import { Container, Table } from 'react-bootstrap';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};

// =====================

// ***************************     This configuration for Multichain Project   *************************** 
// but need to AlchemyMultichainClient class from https://github.com/alchemyplatform/alchemy-multichain-demo.git

// const overrides = {
//     // TODO: Replace with your API keys.
//     [Network.MATIC_MAINNET]: { apiKey: process.env.REACT_APP_MATIC_ALCHEMY_API_KEY, maxRetries: 10 }, // Replace with your Matic Alchemy API key.
//     [Network.ARB_MAINNET]: { apiKey: process.env.REACT_APP_ARB_ALCHEMY_API_KEY } // Replace with your Arbitrum Alchemy API key.
// };

// =====================


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
export const alchemy = new Alchemy(settings);


export function Home() {
    const [latestBlocks, setLatestBlocks] = useState();
    const [blockNumber, setBlockNumber] = useState();
    const [latestTransactions, setLatestTransactions] = useState();

    useEffect(() => {
        let blockArray = [];
        let transactionArray = [];
        const getLatestBlocks = async () => {
            const blockNumber = await alchemy.core.getBlockNumber()
            console.log('blockNumber', blockNumber);
            setBlockNumber(blockNumber);
            for (let i = 0; i < 15; i++) {
                const block = await alchemy.core.getBlock(blockNumber - i);
                blockArray.push(block);
            }
            setLatestBlocks(blockArray);
            console.log("latest block: ", await latestBlocks);
        }

        const getLatestTransactions = async () => {
            const lastBlock = await alchemy.core.getBlockWithTransactions(blockNumber);
            for (let i = 0; i < 15; i++) {
                transactionArray.push(lastBlock.transactions[i]);
            }
            setLatestTransactions(transactionArray);
            console.log("latest transactions: ", latestTransactions);
        }

        //  
        // *************************** code for multichain ***************************

        // const getmainnetNfts = async () => {
        //     const owner = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';
        //     const mainnetNfts = await alchemy
        //         .forNetwork(Network.ETH_MAINNET)
        //         .nft.getNftsForOwner(owner, { pageSize: 5 });
        //     const maticNfts = await alchemy
        //         .forNetwork(Network.MATIC_MAINNET)
        //         .nft.getNftsForOwner(owner, { pageSize: 5 });

        //     console.log('mainnetNfts', mainnetNfts);
        //     console.log('maticNfts', maticNfts);
        // }
        // getmainnetNfts();
        //         *************************** * ***************************


        getLatestBlocks();
        getLatestTransactions();

    }, []);

    return (
        <div>
            <Container className="wrapper">
                <br />
                {!latestTransactions || !latestBlocks ? (
                    <div> Loading... </div>
                ) : (
                    <>
                        <Container className="latestBlock">
                            <Table striped responsive hover>
                                <thead>
                                    <tr>
                                        <th>Latest Blocks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(latestBlocks.map((block, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>Block <Link to={`/block/${block.number}`}>{block.number}</Link> </td>
                                                <td>Fee recipient <Link to={`/address/${block.miner}`}>{block.miner.slice(0, 10)}...</Link></td>
                                                <td>{block.transactions.length} tx</td>
                                            </tr>)
                                    }))}
                                </tbody>
                            </Table>
                        </Container>
                        <Container className="latestTable">
                            <Table striped responsive hover>
                                <thead>
                                    <tr>
                                        <th>Latest Transactions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(latestTransactions.map((transaction, i) => {
                                        return (
                                            <tr key={i}>
                                                <td><Link to={`/transaction/${transaction.hash}`}>{transaction.hash.slice(0, 15)}...</Link></td>
                                                <td>
                                                    From: <Link to={`/address/${transaction.from}`}>{transaction.from.slice(0, 10)}...</Link>
                                                    <br />
                                                    To: <Link to={`/address/${transaction.to}`}>{transaction.to.slice(0, 10)}...</Link>
                                                </td>
                                                <td>{formatEther(transaction.value).slice(0, 5)} ETH</td>
                                            </tr>)
                                    }))}
                                </tbody>
                            </Table>
                        </Container>
                    </>
                )}
            </Container>
        </div>
    );
}
