const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const BlockChain = require('./blockchain');
const bitcoin = new BlockChain();
const uuid = require("uuid").v4;
const nodeAddress = uuid().split('-').join('');
const port = process.argv[2];
const rp = require('request-promise');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/blockchain', (req, res) => {

res.send(bitcoin);
    
  })

  app.post ('/transaction' ,(req,res) =>{
      const newTransaction = req.body;
      const blockIndex = bitcoin.addTransacitonsToPendingTransaction(newTransaction);
      res.json({
        note: `Transaction will be added to block ${blockIndex} .`
    })

    //Going to create new tranasction in the blockchain
    // let amount = req.body.amount;
    // let sender = req.body.sender;
    // let recipient = req.body.receiver;
    // const blockIndex = bitcoin.createNewTransaction(amount,sender,recipient);
    // res.json({
    //     note: `Transaction will be added to block ${blockIndex} .`
    // })
    //   console.log(req.body)
    //   res.send(`It workd ${req.body.amount}`)

  });

  app.get ('/mine' , (req,res) =>{
      const previousBlock  = bitcoin.getLastBlock();
      const previousBlockHash = previousBlock['hash']; 
      const currentBlockData = {
          transactions: bitcoin.pendingTransactions,
          index: previousBlock['index']+ 1
      }
      const nonce = bitcoin.proofOfWork(previousBlockHash,currentBlockData);
      const hash = bitcoin.hashBlock(previousBlockHash,currentBlockData,nonce);
      //bitcoin.createNewTransaction(12.5,"00",nodeAddress);
      const newBlock =  bitcoin.createNewBlock(nonce,previousBlockHash,hash);
      const requestPromises = [];
      bitcoin.networkNodes.forEach(networkNodeUrl=>{
          const requestOptions = {
              uri: networkNodeUrl + '/receive-new-block',
              method: POST,
              body: {newBlock: newBlock},
              json: true
          };
          requestPromises.push(rp(requestOptions));

      }); 

      Promise.all(requestPromises)
      .then (data => {
          const requestOptions = {
              uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
              method: 'POST',
              body: {
                  amount: 12.5,
                  sender: "00",
                  recipient: nodeAddress
              },
              json: true
          };
          return rp(requestOptions);
      })
      .then(data =>{
        res.json({
            note: "New Block Mined Successfully",
            block : newBlock
        });

      })
       

  });

  app.post ('/register-and-broadcast-node' ,(req,res) =>{
      const newNodeUrl = req.body.newNodeUrl;

       if (bitcoin.networkNodes.indexOf(newNodeUrl== -1)) bitcoin.networkNodes.push(newNodeUrl);
       const regNodesPromises = []
       bitcoin.networkNodes.forEach(networkNodeUrl =>{
           //register-node-endpoint
           const requestOptions = {
               uri: networkNodeUrl + '/register-node',
               method: 'POST',
               body :{newNodeUrl: newNodeUrl},
               JSON: true
           }; 
           regNodesPromises.push (rp(requestOptions));

          
       })
       Promise.all(regNodesPromises)
  .then(data =>{

    const bulkRegisterOptions = {
        url: newNodeUrl + '/register-nodes-bulk',
        method: 'POST',
        body: {
            allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]
        },
        json: true
    };
    return rp(bulkRegisterOptions);
})
.then (data=>{
    res.json({note: 'New Node Registered with network successfully'})
});
       });

  app.post ('/register-node', (req,res)=>{
      const newNodeUrl= req.body.newNodeUrl;
      console.log(newNodeUrl);
      const nodeNotAlreadypresent = bitcoin.networkNodes.indexOd(newNodeUrl) == -1;
      const notCurrentNodeUrl = bitcoin.currentNodeUrl  !== newNodeUrl;
      if (nodeNotAlreadypresent && notCurrentNodeUrl)bitcoin.networkNodes.push(newNodeUrl);
      res.json({
          node: 'New Node Registerd successfully with node'
      });

  });

  app.post('/register-nodes-bulk' , (req,res)=>{
      const allNetworkNodes = req.body.allNetworkNodes;
      allNetworkNodes.forEach(networkNodeUrl => {
          const nodeNotAlreadypresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
          const notCurrentNode  = bitcoin.currentNodeUrl !== networkNodeUrl;
      if (nodeNotAlreadypresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl)
      });


  });

  app.post('/transaction/broadcast', (req,res) =>{
      amount = req.body.amount;
      sender = req.body.sender;
      recipient = req.body.receiver;
      const requestPromises = []

      const newTransaction = bitcoin.createNewTransaction(amount,sender,recipient);
      bitcoin.addTransacitonsToPendingTransaction(newTransaction);
      bitcoin.networkNodes.forEach(networkNodeUrl => {
          const requestOptions = {
              uri : networkNodeUrl + '/transaction',
              method: 'POST',
              body : newTransaction,
              json: true
          };
          requestPromises.push(requestOptions);

      }
      ); 

      Promise.all(requestPromises) 
      .then (data=>{
          res.json ({
              note: `Transaction created and broadcasted successfully `
          })
      })
  })


  
app.listen(port, ()=>{
    console.log(`listening on Port ${port}...`)
});