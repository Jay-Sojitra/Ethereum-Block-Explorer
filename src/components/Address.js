import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { alchemy } from "./Home";
import { formatEther } from "ethers/lib/utils";
import { Alert, Table, Container } from "react-bootstrap";

export function Address() {
    const { id } = useParams();
    const [balance, setBalance] = useState("");
    const [tokens, setTokens] = useState([]);

    useEffect(() => {
        const getAddress = async () => {
            const balance = await alchemy.core.getBalance(id, "latest");
            setBalance(formatEther(balance));

            const tbalance = await alchemy.core.getTokenBalances(id);
            console.log('id', id);
            console.log('tbalance', tbalance);

            let vitalikAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
            let usdcContract = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

            //Call the method
            let response = await alchemy.core.getTokenBalances(vitalikAddress, [usdcContract])
            console.log('response', response);


            const nonZeroTokenBalance = tbalance.tokenBalances.filter((token) => { return parseInt(token.tokenBalance) !== 0 });
            console.log("nonZero: ", nonZeroTokenBalance);

            let tokensArray = [];
            for (let i = 0; i < nonZeroTokenBalance.length; i++) {
                let tokenObj = {};
                let balance = nonZeroTokenBalance[i].tokenBalance;
                const metadata = await alchemy.core.getTokenMetadata(nonZeroTokenBalance[i].contractAddress);

                balance = balance / Math.pow(10, metadata.decimals);
                tokenObj = { name: metadata.name, symbol: metadata.symbol, balance: balance };
                tokensArray.push(tokenObj);
            }
            setTokens(tokensArray);
        }
        getAddress();
    }, [id]);

    console.log("id: ", id);
    console.log("balance: ", balance);;
    console.log("tokens Array: ", tokens);


    return (
        <>
            <Container>
                <br />
                <h3>Address</h3>
                <Table striped bordered responsive>
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>Address: </td>
                            <td>{id}</td>
                        </tr>
                        <tr>
                            <td>Balance: </td>
                            <td>{balance.slice(0, 7)} ETH </td>
                        </tr>
                    </tbody>
                </Table>
                <br />
                <h3>Tokens</h3>
                {tokens.length === 0 ? (
                    <div>
                        <Alert variant="warning">
                            This address does not hold any tokens.
                        </Alert>
                    </div>
                ) : (<Table bordered responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Symbol</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(tokens.map((token, i) => {
                            return (
                                <tr key={i}>
                                    <td>{token.name}</td>
                                    <td>{token.symbol}</td>
                                    <td>{token.balance}</td>
                                </tr>
                            )
                        }))
                        }
                    </tbody>
                </Table>)}
            </Container>

        </>
    )
}
