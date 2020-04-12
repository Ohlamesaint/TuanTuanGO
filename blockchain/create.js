const Web3 = require('web3');
const config = require('./config.json');
const request = require('request');
const ethers = require('ethers');
let abi = [
	{
		"constant": false,
		"inputs": [],
		"name": "check_time",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "join",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "count",
				"type": "uint256"
			},
			{
				"name": "money",
				"type": "uint256"
			},
			{
				"name": "good",
				"type": "uint256"
			}
		],
		"name": "set_max",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "trade",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "count",
				"type": "uint256"
			},
			{
				"name": "money",
				"type": "uint256"
			},
			{
				"name": "good",
				"type": "uint256"
			},
			{
				"name": "minute",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "status",
				"type": "bool"
			}
		],
		"name": "contract_status",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allUsers",
		"outputs": [
			{
				"name": "userAddress",
				"type": "address"
			},
			{
				"name": "withdrawalAmount",
				"type": "uint256"
			},
			{
				"name": "count",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "check",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "get_contr",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "get_max_count",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "get_owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "get_price",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "get_time",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "get_user_count",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "i",
				"type": "uint256"
			}
		],
		"name": "get_user_name",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];
let abi2=[
	{
		"constant": false,
		"inputs": [
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "join",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "get_owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "get_max_count",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "count",
				"type": "uint256"
			},
			{
				"name": "money",
				"type": "uint256"
			}
		],
		"name": "set_max",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "get_price",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "trade",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "i",
				"type": "uint256"
			}
		],
		"name": "get_user_name",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "check_time",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "check",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "get_time",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "get_contr",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allUsers",
		"outputs": [
			{
				"name": "userAddress",
				"type": "address"
			},
			{
				"name": "count",
				"type": "uint256"
			},
			{
				"name": "withdrawalAmount",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "get_user_count",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "count",
				"type": "uint256"
			},
			{
				"name": "money",
				"type": "uint256"
			},
			{
				"name": "minute",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "status",
				"type": "bool"
			}
		],
		"name": "contract_status",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "full",
				"type": "bool"
			}
		],
		"name": "contract_full",
		"type": "event"
	}
];
module.exports = {
	//need password as parameter and return 1.address 2.privatekey or false
    create:async function (pass){ 
		return new Promise(async function(resolve, reject) {
        const web3 = new Web3(new Web3.providers.HttpProvider(config["network"]));
        let c = web3.eth.accounts.create(pass);//create account
        let e = c.encrypt(pass);//encrypt the account to get privatekey
        var tmp = String(c.privateKey);
		tmp = tmp.split("x");
		var account = new Object();
		var error_create;
        // set rpc to call personal_importRawKey,import account to keystore in server.
        let options = {
            url: config["network"],
            method: "post",
            headers:
            { 
                "Content-Type":"application/json"
            },
            body: JSON.stringify( {"jsonrpc": "2.0", "id": "123456", "method": "personal_importRawKey", "params": [tmp[1],pass] })
        };
        await request(options, (error, response, body) => {
			error_create = error;
            if (error) {
				console.error('An error has occurred: ', error);
				reject(false);
            } else {
				console.log('Post successful: response: ', body);
				account.address = e.address;
				account.privatekey = c.privateKey;
				resolve(account);
            }
		});
		})
	},
	//need address and how much user want,console log transaction certification msg,return true\false
    send:async function(address,ether){
		return new Promise(async function(resolve, reject) {
        const provider = new ethers.providers.JsonRpcProvider(config["network"]);
        let privateKey = "0xa1a26a87aa114a4d5b9361f0ad722a1565b9683c06136985054ac454177d4c10"
        let wallet = new ethers.Wallet(privateKey, provider);
        let amount = ethers.utils.parseEther(String(ether));
        let tx = {
            to: String(address),
            // We must pass in the amount as wei (1 ether = 1e18 wei), so we
            // use this convenience function to convert ether to wei.
			value: amount,
			gasPrice:ethers.utils.parseUnits('0.0','gwei')
        };
        //console.log("Waiting transaction certification....");
		let sendPromise = await wallet.sendTransaction(tx);
		await provider.waitForTransaction(sendPromise.hash).then((receipt) => {
			console.log('Transaction Mined: ' + receipt.hash);
			console.log(receipt);
		});
		console.log("Transaction certification is completed.");
		
			if (sendPromise) resolve(true)
			// 已實現，成功
			else reject(false) // 有錯誤，已拒絕，失敗
		  })
	},
	// need account address and return balance of account
	inquery:async function (privatekey){// need account address and return balance of account
		return new Promise(async function(resolve, reject) {
		const provider = new ethers.providers.JsonRpcProvider(config["network"]);
		var return_balance;
        await provider.getBalance(privatekey).then((balance) => {
			console.log("Balance: " +  ethers.utils.formatEther(balance));
			return_balance =  ethers.utils.formatEther(balance);
        });
			resolve(return_balance);
		  })
	},//0x650cc4dae871e0f34d4a09e6732967d6c42c2a4693203d567eb4da07887aa4db
	// need deployer privateKey,amount of commodity,original price,discount price,duration, console log address,hash,deploy msg and return contract address.
    deploy:async function(amount,original_price,discount_price,duration=60){
		// The bytecode from Solidity, compiling the above source
		return new Promise(async function(resolve, reject) {
		let privateKey = "0xa1a26a87aa114a4d5b9361f0ad722a1565b9683c06136985054ac454177d4c10"
        let bytecode = "608060405234801561001057600080fd5b5060405160808061155c8339810180604052608081101561003057600080fd5b8101908080519060200190929190805190602001909291908051906020019092919080519060200190929190505050600084141515156100bb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602181526020018061153b6021913960400191505060405180910390fd5b60008314151515610134576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807fe784a1e8bcb8e585a5e59586e59381e58e9fe5a78be98791e9a18d000000000081525060200191505060405180910390fd5b600082141515156101ad576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807fe784a1e8bcb8e585a5e59586e59381e68a98e583b9e98791e9a18d000000000081525060200191505060405180910390fd5b8183111515610207576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602c81526020018061150f602c913960400191505060405180910390fd5b600081111515610262576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260218152602001806114ee6021913960400191505060405180910390fd5b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600560006101000a81548160ff0219169083151502179055507f0ab695084fb1744778c5810d6dc5db8695637b1a2524edc3be3f8eb1a2398ff3600560009054906101000a900460ff16604051808215151515815260200191505060405180910390a1426006819055508060078190555083600281905550670de0b6b3a76400008302600381905550670de0b6b3a764000082026004819055505050505061119c806103526000396000f3fe6080604052600436106100df576000357c0100000000000000000000000000000000000000000000000000000000900480636efcc0cb1161009c578063966a196111610076578063966a196114610316578063a06ca2fc14610341578063a2bdedf414610370578063fd33482d146103f9576100df565b80636efcc0cb1461023d57806387c4fc43146102b8578063919840ad146102e7576100df565b8063049878f3146100e45780630ac298dc146101125780630bdce73f146101695780630c5fa9f61461019457806311f37ceb146101e35780631f0ba6c91461020e575b600080fd5b610110600480360360208110156100fa57600080fd5b810190808035906020019092919050505061042b565b005b34801561011e57600080fd5b506101276106fc565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561017557600080fd5b5061017e6107aa565b6040518082815260200191505060405180910390f35b3480156101a057600080fd5b506101e1600480360360608110156101b757600080fd5b810190808035906020019092919080359060200190929190803590602001909291905050506107b4565b005b3480156101ef57600080fd5b506101f8610917565b6040518082815260200191505060405180910390f35b34801561021a57600080fd5b506102236109b8565b604051808215151515815260200191505060405180910390f35b34801561024957600080fd5b506102766004803603602081101561026057600080fd5b8101908080359060200190929190505050610c20565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156102c457600080fd5b506102cd610c69565b604051808215151515815260200191505060405180910390f35b3480156102f357600080fd5b506102fc610d19565b604051808215151515815260200191505060405180910390f35b34801561032257600080fd5b5061032b610e07565b6040518082815260200191505060405180910390f35b34801561034d57600080fd5b50610356610e0f565b604051808215151515815260200191505060405180910390f35b34801561037c57600080fd5b506103a96004803603602081101561039357600080fd5b8101908080359060200190929190505050610e26565b604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001935050505060405180910390f35b34801561040557600080fd5b5061040e610e7f565b604051808381526020018281526020019250505060405180910390f35b600560009054906101000a900460ff1615156104af576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807fe59088e7b484e5b7b2e8a2abe59fb7e8a18ce4b8a6e98ab7e6af80000000000081525060200191505060405180910390fd5b60008114151515610528576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807fe59586e59381e695b8e79baee4b88de5be97e782ba300000000000000000000081525060200191505060405180910390fd5b6000600254141515156105a3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600c8152602001807fe59088e7b484e98cafe8aaa4000000000000000000000000000000000000000081525060200191505060405180910390fd5b80600354023414151561061e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260158152602001807fe4bda0e6b292e4bb98e8b6b3e5a4a0e79a84e98ca2000000000000000000000081525060200191505060405180910390fd5b610626610c69565b5061062f611110565b6060604051908101604052803373ffffffffffffffffffffffffffffffffffffffff1681526020013481526020018381525090506000819080600181540180825580915050906001820390600052602060002090600302016000909192909190915060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010155604082015181600201555050506106f76109b8565b505050565b6000600560009054906101000a900460ff161515610782576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807fe59088e7b484e5b7b2e8a2abe59fb7e8a18ce4b8a6e98ab7e6af80000000000081525060200191505060405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000600254905090565b600560009054906101000a900460ff161515610838576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807fe59088e7b484e5b7b2e8a2abe59fb7e8a18ce4b8a6e98ab7e6af80000000000081525060200191505060405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156108e0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260288152602001806111496028913960400191505060405180910390fd5b6108e8610c69565b5082600281905550670de0b6b3a76400008202600381905550670de0b6b3a76400008102600481905550505050565b6000600560009054906101000a900460ff16151561099d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807fe59088e7b484e5b7b2e8a2abe59fb7e8a18ce4b8a6e98ab7e6af80000000000081525060200191505060405180910390fd5b670de0b6b3a76400006003548115156109b257fe5b04905090565b6000600560009054906101000a900460ff161515610a3e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807fe59088e7b484e5b7b2e8a2abe59fb7e8a18ce4b8a6e98ab7e6af80000000000081525060200191505060405180910390fd5b610a46610c69565b50610a4f610d19565b15610c1857600060045460035403905060008090505b600080549050811015610b2857600081815481101515610a8157fe5b906000526020600020906003020160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc600083815481101515610adb57fe5b90600052602060002090600302016002015484029081150290604051600060405180830381858888f19350505050158015610b1a573d6000803e3d6000fd5b508080600101915050610a65565b50600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f19350505050158015610ba8573d6000803e3d6000fd5b506000600560006101000a81548160ff0219169083151502179055507f0ab695084fb1744778c5810d6dc5db8695637b1a2524edc3be3f8eb1a2398ff3600560009054906101000a900460ff16604051808215151515815260200191505060405180910390a16001915050610c1d565b600090505b90565b60008082815481101515610c3057fe5b906000526020600020906003020160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b6000600560009054906101000a900460ff161515610cef576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807fe59088e7b484e5b7b2e8a2abe59fb7e8a18ce4b8a6e98ab7e6af80000000000081525060200191505060405180910390fd5b603c6007540260065401421115610d1157610d08610edd565b60009050610d16565b600190505b90565b6000600560009054906101000a900460ff161515610d9f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807fe59088e7b484e5b7b2e8a2abe59fb7e8a18ce4b8a6e98ab7e6af80000000000081525060200191505060405180910390fd5b600080905060008090505b600080549050811015610de957600081815481101515610dc657fe5b906000526020600020906003020160020154820191508080600101915050610daa565b50600254811415610dfe576001915050610e04565b60009150505b90565b600042905090565b6000600560009054906101000a900460ff16905090565b600081815481101515610e3557fe5b90600052602060002090600302016000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010154908060020154905083565b600080600080905060008090505b600080549050811015610ecc57600081815481101515610ea957fe5b906000526020600020906003020160020154820191508080600101915050610e8d565b506000805490508192509250509091565b600560009054906101000a900460ff161515610f61576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807fe59088e7b484e5b7b2e8a2abe59fb7e8a18ce4b8a6e98ab7e6af80000000000081525060200191505060405180910390fd5b6000600560006101000a81548160ff0219169083151502179055507f0ab695084fb1744778c5810d6dc5db8695637b1a2524edc3be3f8eb1a2398ff3600560009054906101000a900460ff16604051808215151515815260200191505060405180910390a160008090505b60008054905081101561108d57600081815481101515610fe857fe5b906000526020600020906003020160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc60008381548110151561104257fe5b9060005260206000209060030201600101549081150290604051600060405180830381858888f1935050505015801561107f573d6000803e3d6000fd5b508080600101915050610fcc565b50600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f1935050505015801561110d573d6000803e3d6000fd5b50565b606060405190810160405280600073ffffffffffffffffffffffffffffffffffffffff1681526020016000815260200160008152509056fee683b3e8ac80e6ac8ae7afa1e4bd8d3f20596f752073686f756c64206e6f74206265207061737321a165627a7a72305820179a13e53e727cf215f35389e5af2fa95b4a36de6e0083eaff645a3f7acd0bc70029e98099e4bbbde59088e7b484e883bde6b4bbe5a49ae4b98528e58886e99098293fe68a98e583b9e5be8ce6808ee9babce6af94e58e9fe583b9e98284e8b2b42ce9bb91e5bf83e59586e4baba3fe4bda0e7a2bae5ae9ae8a681e59c98e8b3bc30e4bbb6e59586e593813f3f3f3f3f";
        // Connect to the network
		let provider = new ethers.providers.JsonRpcProvider(config["network"]);
        let wallet = new ethers.Wallet(privateKey, provider);
		let override={
            gasPrice : ethers.utils.parseUnits('0.0','gwei')
        };
        console.log(amount+","+original_price+","+discount_price+","+duration);
		let factory = new ethers.ContractFactory(abi, bytecode, wallet);
		let contract = await factory.deploy(amount,original_price,discount_price,duration,override);
		console.log(contract.address);
		console.log(contract.deployTransaction.hash);
		console.log("Wait contract to be deployed...");
		await contract.deployed();
		console.log("Constract has been deployed...");
			resolve(contract.address);
		  })
	},
	deploy_unpack:async function(amount,original_price,duration=60){
		// The bytecode from Solidity, compiling the above source
		return new Promise(async function(resolve, reject) {
		let privateKey = "0xa1a26a87aa114a4d5b9361f0ad722a1565b9683c06136985054ac454177d4c10"
        let bytecode = "608060405234801561001057600080fd5b5060405160608061138b8339810180604052606081101561003057600080fd5b81019080805190602001909291908051906020019092919080519060200190929190505050600083141515156100b1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602181526020018061136a6021913960400191505060405180910390fd5b6000821415151561012a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807fe784a1e8bcb8e585a5e59586e59381e58e9fe5a78be98791e9a18d000000000081525060200191505060405180910390fd5b600081111515610185576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260218152602001806113496021913960400191505060405180910390fd5b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600460006101000a81548160ff0219169083151502179055507f0ab695084fb1744778c5810d6dc5db8695637b1a2524edc3be3f8eb1a2398ff3600460009054906101000a900460ff16604051808215151515815260200191505060405180910390a17fe813d1fbb8dc59081e2e6d1139dd3e089af53c0e7c27dacaf9c6deca84d891c06000604051808215151515815260200191505060405180910390a1426005819055508060068190555082600281905550670de0b6b3a764000082026003819055505050506110aa8061029f6000396000f3fe6080604052600436106100df576000357c0100000000000000000000000000000000000000000000000000000000900480636efcc0cb1161009c578063966a196111610076578063966a19611461030c578063a06ca2fc14610337578063a2bdedf414610366578063fd33482d146103ef576100df565b80636efcc0cb1461023357806387c4fc43146102ae578063919840ad146102dd576100df565b8063049878f3146100e45780630ac298dc146101125780630bdce73f146101695780631197538e1461019457806311f37ceb146101d95780631f0ba6c914610204575b600080fd5b610110600480360360208110156100fa57600080fd5b8101908080359060200190929190505050610421565b005b34801561011e57600080fd5b506101276106f2565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561017557600080fd5b5061017e6107a0565b6040518082815260200191505060405180910390f35b3480156101a057600080fd5b506101d7600480360360408110156101b757600080fd5b8101908080359060200190929190803590602001909291905050506107aa565b005b3480156101e557600080fd5b506101ee6108fb565b6040518082815260200191505060405180910390f35b34801561021057600080fd5b5061021961099c565b604051808215151515815260200191505060405180910390f35b34801561023f57600080fd5b5061026c6004803603602081101561025657600080fd5b8101908080359060200190929190505050610b2e565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156102ba57600080fd5b506102c3610b77565b604051808215151515815260200191505060405180910390f35b3480156102e957600080fd5b506102f2610c27565b604051808215151515815260200191505060405180910390f35b34801561031857600080fd5b50610321610d15565b6040518082815260200191505060405180910390f35b34801561034357600080fd5b5061034c610d1d565b604051808215151515815260200191505060405180910390f35b34801561037257600080fd5b5061039f6004803603602081101561038957600080fd5b8101908080359060200190929190505050610d34565b604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001935050505060405180910390f35b3480156103fb57600080fd5b50610404610d8d565b604051808381526020018281526020019250505060405180910390f35b600460009054906101000a900460ff1615156104a5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807fe59088e7b484e5b7b2e8a2abe59fb7e8a18ce4b8a6e98ab7e6af80000000000081525060200191505060405180910390fd5b6000811415151561051e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807fe59586e59381e695b8e79baee4b88de5be97e782ba300000000000000000000081525060200191505060405180910390fd5b600060025414151515610599576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600c8152602001807fe59088e7b484e98cafe8aaa4000000000000000000000000000000000000000081525060200191505060405180910390fd5b806003540234141515610614576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260158152602001807fe4bda0e6b292e4bb98e8b6b3e5a4a0e79a84e98ca2000000000000000000000081525060200191505060405180910390fd5b61061c610b77565b5061062561101e565b6060604051908101604052803373ffffffffffffffffffffffffffffffffffffffff1681526020018381526020013481525090506000819080600181540180825580915050906001820390600052602060002090600302016000909192909190915060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010155604082015181600201555050506106ed61099c565b505050565b6000600460009054906101000a900460ff161515610778576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807fe59088e7b484e5b7b2e8a2abe59fb7e8a18ce4b8a6e98ab7e6af80000000000081525060200191505060405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000600254905090565b600460009054906101000a900460ff16151561082e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807fe59088e7b484e5b7b2e8a2abe59fb7e8a18ce4b8a6e98ab7e6af80000000000081525060200191505060405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156108d6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260288152602001806110576028913960400191505060405180910390fd5b6108de610b77565b5081600281905550670de0b6b3a764000081026003819055505050565b6000600460009054906101000a900460ff161515610981576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807fe59088e7b484e5b7b2e8a2abe59fb7e8a18ce4b8a6e98ab7e6af80000000000081525060200191505060405180910390fd5b670de0b6b3a764000060035481151561099657fe5b04905090565b6000600460009054906101000a900460ff161515610a22576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807fe59088e7b484e5b7b2e8a2abe59fb7e8a18ce4b8a6e98ab7e6af80000000000081525060200191505060405180910390fd5b610a2a610b77565b50610a33610c27565b15610b2657600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f19350505050158015610ab7573d6000803e3d6000fd5b506000600460006101000a81548160ff0219169083151502179055507f0ab695084fb1744778c5810d6dc5db8695637b1a2524edc3be3f8eb1a2398ff3600460009054906101000a900460ff16604051808215151515815260200191505060405180910390a160019050610b2b565b600090505b90565b60008082815481101515610b3e57fe5b906000526020600020906003020160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b6000600460009054906101000a900460ff161515610bfd576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807fe59088e7b484e5b7b2e8a2abe59fb7e8a18ce4b8a6e98ab7e6af80000000000081525060200191505060405180910390fd5b603c6006540260055401421115610c1f57610c16610deb565b60009050610c24565b600190505b90565b6000600460009054906101000a900460ff161515610cad576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807fe59088e7b484e5b7b2e8a2abe59fb7e8a18ce4b8a6e98ab7e6af80000000000081525060200191505060405180910390fd5b600080905060008090505b600080549050811015610cf757600081815481101515610cd457fe5b906000526020600020906003020160010154820191508080600101915050610cb8565b50600254811415610d0c576001915050610d12565b60009150505b90565b600042905090565b6000600460009054906101000a900460ff16905090565b600081815481101515610d4357fe5b90600052602060002090600302016000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010154908060020154905083565b600080600080905060008090505b600080549050811015610dda57600081815481101515610db757fe5b906000526020600020906003020160010154820191508080600101915050610d9b565b506000805490508192509250509091565b600460009054906101000a900460ff161515610e6f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807fe59088e7b484e5b7b2e8a2abe59fb7e8a18ce4b8a6e98ab7e6af80000000000081525060200191505060405180910390fd5b6000600460006101000a81548160ff0219169083151502179055507f0ab695084fb1744778c5810d6dc5db8695637b1a2524edc3be3f8eb1a2398ff3600460009054906101000a900460ff16604051808215151515815260200191505060405180910390a160008090505b600080549050811015610f9b57600081815481101515610ef657fe5b906000526020600020906003020160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc600083815481101515610f5057fe5b9060005260206000209060030201600201549081150290604051600060405180830381858888f19350505050158015610f8d573d6000803e3d6000fd5b508080600101915050610eda565b50600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f1935050505015801561101b573d6000803e3d6000fd5b50565b606060405190810160405280600073ffffffffffffffffffffffffffffffffffffffff1681526020016000815260200160008152509056fee683b3e8ac80e6ac8ae7afa1e4bd8d3f20596f752073686f756c64206e6f74206265207061737321a165627a7a72305820ff3530b0e65146c941551ccdb23aff89b7b5c3bda5bc14d84b5ac04f2c5e1b120029e98099e4bbbde59088e7b484e883bde6b4bbe5a49ae4b98528e58886e99098293fe4bda0e7a2bae5ae9ae8a681e59c98e8b3bc30e4bbb6e59586e593813f3f3f3f3f";
        // Connect to the network
		let provider = new ethers.providers.JsonRpcProvider(config["network"]);
        let wallet = new ethers.Wallet(privateKey, provider);
		let override={
            gasPrice : ethers.utils.parseUnits('0.0','gwei')
        };
        console.log(amount+","+original_price+","+duration);
		let factory = new ethers.ContractFactory(abi2, bytecode, wallet);
		let contract = await factory.deploy(amount,original_price,duration,override);
		console.log(contract.address);
		console.log(contract.deployTransaction.hash);
		console.log("Wait contract to be deployed...");
		await contract.deployed();
		console.log("Constract has been deployed...");
			resolve(contract.address);
		  })
	},
	//need contractAddress and return status of contract 
    check_contract_status:async function(contractAddress){
		// Connect to the network
		return new Promise(async function(resolve, reject) {
        let provider = new ethers.providers.JsonRpcProvider(config["network"]);

        // We connect to the Contract using a Provider, so we will only
        // have read-only access to the Contract
        let contract = new ethers.Contract(contractAddress, abi, provider);
            // Get the current value
		try{
		let currentStatus = await contract.get_contr();
		console.log(currentStatus);
			resolve(currentStatus);
		}catch{
			reject(false);
		}});
	},
	//need contractAddress and return count of people and commodity they bought
    amount_of_user:async function(contractAddress){
		// Connect to the network
		return new Promise(async function(resolve, reject) {
        let provider = new ethers.providers.JsonRpcProvider(config["network"]);
        let contract = new ethers.Contract(contractAddress, abi, provider);
		// Get the current value
		let tx = await contract.get_user_count();
		console.log(parseInt(tx[0]._hex, 16),parseInt(tx[1]._hex, 16));
			resolve({user:parseInt(tx[0]._hex, 16),commodity:parseInt(tx[1]._hex, 16)});
		  })
	},
	//need contractAddress and return array of all user
    list_user:async function(contractAddress){
		// Connect to the network
		return new Promise(async function(resolve, reject) {
        let provider = new ethers.providers.JsonRpcProvider(config["network"]);
		let contract = new ethers.Contract(contractAddress, abi, provider);
		var list = new Array();
		// Get the current value
		let tx = await contract.get_user_count();
			var index=  parseInt(tx[0]._hex, 16);
			console.log(index);
			for(let i=0;i < index;i++){
				let tg = await contract.get_user_name(i);
				console.log(tg);
				list.push(tg);
			}
			resolve(list);
		  })
	},
	//
	
	/*need contractAddress,privateKey,amount client want to buy return three cases
	* case1: success to join
	* case2: fail to join
	* case3: msg: (You want to purchase too much)
	*/
    join:async function(contractAddress,privateKey,amount){
		// Connect to the network
		return new Promise(async function(resolve, reject) {
        let provider = new ethers.providers.JsonRpcProvider(config["network"]);
        let contract = new ethers.Contract(contractAddress, abi, provider);
        let wallet = new ethers.Wallet(privateKey, provider);
        try{
            var available = contract.get_contr();
            if(!available){
                console.log("This contract is not available");
					reject(false);
            }
        }catch{
			console.log("This contract address may not be available");
				reject(false);
        }
        let check = parseInt(await contract.get_max_count(), 16);
        console.log(check);
        if(amount > check){
			console.log("You want to purchase too much");
				reject(false);
        }
        let override={
            gasPrice : ethers.utils.parseUnits('0.0','gwei'),
            value: ethers.utils.parseEther(String(amount*await contract.get_price()))
          };
        console.log(override.value,amount);
        // Create a new instance of the Contract with a Signer, which allows
        // update methods
        let contractWithSigner = contract.connect(wallet);
        let tx;
        try{
			console.log("Wait transaction of joining to be certified...");
            tx = await contractWithSigner.join(amount,override);
			resolve(true);
        }
        catch{
            console.log(tx);
            console.log("join fail");
				reject(false);
        }
	})
	},
	// Don't need to transfer parameter and return list of users and their balance
	list_balance:async function(){
		return new Promise(async function(resolve, reject) {
		let provider = new ethers.providers.JsonRpcProvider(config["network"]);
		var list;
		var list_balance = new Array();
		list = await provider.listAccounts();
		~async function() {
			for(let i = 0;i < list.length;i++){
				provider.getBalance(list[i]).then((balance) => {
					list_balance.push("Balance of "+list[i]+" : " +  ethers.utils.formatEther(balance));
				});}
		}().then(resolve(list_balance));
		})
	}
}