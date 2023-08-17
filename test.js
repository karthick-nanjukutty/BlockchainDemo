const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

// bitcoin.createNewBlock(100,'7483784783','89849839');
// bitcoin.createNewBlock(120,'74erere83784783','8129849839');

// bitcoin.createNewBlock(150,'HASH7478i83784783','HASH8984319839');

// bitcoin.createNewTransaction(120,'AlexHJGUKDIDDEIEIMD','JenHSUSHUWUWJWUDND');

// bitcoin.createNewBlock(151,'HASH76478i83784783','HASH97984319839');
currentBlockData = [
    {
        amount: 10,
        sender: 'AHSSHSUDHFJDJFDKFDJU',
        recipient: 'skjhehruehruehji'
    }, 
    {
        amount: 30,
        sender: 'AHkhgfjdhjHSUDHFJDJFDKFDJU',
        recipient: 'AHSHSHskjhehruehruehji'

    }
    

   


]

previousBlochkHash = 'AlsexGAKSISUKSI';


//hash = bitcoin.hashBlock('AlsexGAKSISUKSI',currentBlockData, 100);
// pow = bitcoin.proofOfWork(previousBlochkHash,currentBlockData);
// console.log(pow);

//to prove that the block is valid:
//hash = bitcoin.hashBlock (previousBlochkHash,currentBlockData,36902)
//console.log(hash);


//console.log(bitcoin.chain['hash']);

//console.log ('hash is ', hash);