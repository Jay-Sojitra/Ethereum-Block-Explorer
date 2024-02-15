import { Route, Routes, Link } from 'react-router-dom';
import { Home } from './components/Home';
import { Block } from './components/Block';
import { Transaction } from './components/Transaction'
import { Address } from './components/Address'
import { BlockTransactions } from './components/BlockTransactions';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button } from 'react-bootstrap';

import './App.css';



function App() {

  return (
  <div>
      <Container>
      <br/>
      <div>
        <Link to={"/"}><Button variant="light"><h1>Ethereum Block Explorer</h1></Button></Link>
      </div>
      </Container>
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/block/:id" element={<Block />}/>
        <Route path="/transaction/:id" element={<Transaction />}/>
        <Route path="/address/:id" element={<Address />}/>
        <Route path="/blockTransactions/:id" element={<BlockTransactions />}/>
      </Routes>
      <div>
        <footer>Made by JAY</footer>
      </div>
  </div>
  );
}

export default App;
