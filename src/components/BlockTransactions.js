import { Link } from "react-router-dom";
import { Container, Table } from "react-bootstrap";
import { formatEther } from "ethers/lib/utils";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { alchemy } from "./Home";

export function BlockTransactions(){
    const { id } = useParams();
    const [block, setBlock] = useState();
    
    useEffect(() => {
        const getBlock = async () => {
            const block = await alchemy.core.getBlockWithTransactions(parseInt(id));
            setBlock(block);
        }
        getBlock();        
    }, [id]);

    console.log(block);

    return (
    <div>
        <Container>
        <br/>
        {!block ? (
            <div> Loading... </div>
        ) : (
        <>
        <Container>
            <br/>
            <h3>All Transactions in Block #{block.number}</h3>
            <br/>
            <Table responsive>
                <thead>
                    <tr>
                        <td>Transaction Hash</td>
                        <td>From</td>
                        <td>To</td>
                        <td>Value</td>
                    </tr>
                </thead>
                <tbody>
                    {(block.transactions.map((transaction, i) => {
                        return (
                            <tr key={i}>
                                <td><Link to={`/transaction/${transaction.hash}`}>{transaction.hash?.slice(0, 20)}...</Link></td>
                                <td><Link to={`/address/${transaction.from}`}>{transaction.from?.slice(0,10)}...</Link></td> 
                                <td><Link to={`/address/${transaction.to}`}>{transaction.to?.slice(0, 10)}...</Link></td>
                                <td>{formatEther(transaction.value)?.slice(0,5)} ETH</td>
                            </tr>)
                        }))}
                </tbody>
            </Table>
        </Container>
        </>)}
        </Container>
    </div>
    );
}