import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { alchemy } from "./Home";
import { Button, Container, Table } from "react-bootstrap";

export function Block() {
    const { id } = useParams();
    const [block, setBlock] = useState();

    useEffect(() => {
        const getBlock = async () => {
            const block = await alchemy.core.getBlockWithTransactions(parseInt(id));
            setBlock(block);
        }

        getBlock();
    }, [id]);

    console.log('block', block);


    return (
        <div>
            <Container>
                {!block ? (
                    <div> Loading... </div>
                ) : (
                    <>
                        <Container>
                            <br />

                            <h3>Block #{block.number}</h3> <Link to={`/block/${block.number - 1}`}><Button variant="outline-primary" size="sm">Previous Block</Button></Link> <Link to={`/block/${block.number + 1}`}><Button variant="outline-primary" size="sm">Next Block</Button></Link>
                            <br />
                            <Table responsive>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td>Block Height:</td>
                                        <td>{block.number}</td>
                                    </tr>
                                    <tr>
                                        <td>Timestamp:</td>
                                        <td>{block.timestamp}</td>
                                    </tr>
                                    <tr>
                                        <td>Gas Used:</td>
                                        <td>{block.gasUsed.toString()}</td>
                                    </tr>
                                    <tr>
                                        <td>Gas Limit:</td>
                                        <td>{block.gasLimit.toString()}</td>
                                    </tr>
                                    <tr>
                                        <td>Fee Recipient:</td>
                                        <td><Link to={`/address/${block.miner}`}>{block.miner}</Link></td>
                                    </tr>
                                    <tr>
                                        <td>Hash:</td>
                                        <td>{block.hash}</td>
                                    </tr>
                                    <tr>
                                        <td>Parent Hash:</td>
                                        <td><Link to={`/block/${block.number - 1}`}>{block.parentHash}</Link></td>
                                    </tr>
                                    <tr>
                                        <td>Transactions:</td>
                                        <td><Link to={`/blockTransactions/${block.number}`}><Button>{block.transactions.length} transactions</Button></Link></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Container>
                    </>
                )}
            </Container>
        </div>);
}
