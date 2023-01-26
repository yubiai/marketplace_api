const erc20 = [
  {
    constant: false,
    inputs: [
      {
        name: "spender",
        type: "address",
      },
      {
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "spender",
        type: "address",
      },
      {
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "spender",
        type: "address",
      },
      {
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "recipient",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "sender",
        type: "address",
      },
      {
        name: "recipient",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    constant: true,
    inputs: [
      {
        name: "owner",
        type: "address",
      },
      {
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

const arbitrator = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "_pinakion",
        "type": "address"
      }
    ],
    "name": "changePinakion",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "RNBlock",
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
    "name": "disputesWithoutJurors",
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
    "name": "passPhase",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "governor",
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
    "name": "lastDelayedSetStake",
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
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      }
    ],
    "name": "disputeStatus",
    "outputs": [
      {
        "name": "status",
        "type": "uint8"
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
        "name": "_disputeID",
        "type": "uint256"
      }
    ],
    "name": "passPeriod",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "maxDrawingTime",
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
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      }
    ],
    "name": "currentRuling",
    "outputs": [
      {
        "name": "ruling",
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "courts",
    "outputs": [
      {
        "name": "parent",
        "type": "uint96"
      },
      {
        "name": "hiddenVotes",
        "type": "bool"
      },
      {
        "name": "minStake",
        "type": "uint256"
      },
      {
        "name": "alpha",
        "type": "uint256"
      },
      {
        "name": "feeForJuror",
        "type": "uint256"
      },
      {
        "name": "jurorsForCourtJump",
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
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "name": "_appeal",
        "type": "uint256"
      },
      {
        "name": "_iterations",
        "type": "uint256"
      }
    ],
    "name": "execute",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "ALPHA_DIVISOR",
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
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "name": "_voteIDs",
        "type": "uint256[]"
      },
      {
        "name": "_choice",
        "type": "uint256"
      },
      {
        "name": "_salt",
        "type": "uint256"
      }
    ],
    "name": "castVote",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_subcourtID",
        "type": "uint96"
      },
      {
        "name": "_minStake",
        "type": "uint256"
      }
    ],
    "name": "changeSubcourtMinStake",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_subcourtID",
        "type": "uint96"
      }
    ],
    "name": "getSubcourt",
    "outputs": [
      {
        "name": "children",
        "type": "uint256[]"
      },
      {
        "name": "timesPerPeriod",
        "type": "uint256[4]"
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
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "name": "_extraData",
        "type": "bytes"
      }
    ],
    "name": "appeal",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "onTransfer",
    "outputs": [
      {
        "name": "allowed",
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "disputes",
    "outputs": [
      {
        "name": "subcourtID",
        "type": "uint96"
      },
      {
        "name": "arbitrated",
        "type": "address"
      },
      {
        "name": "numberOfChoices",
        "type": "uint256"
      },
      {
        "name": "period",
        "type": "uint8"
      },
      {
        "name": "lastPeriodChange",
        "type": "uint256"
      },
      {
        "name": "drawsInRound",
        "type": "uint256"
      },
      {
        "name": "commitsInRound",
        "type": "uint256"
      },
      {
        "name": "ruled",
        "type": "bool"
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
        "name": "_subcourtID",
        "type": "uint96"
      },
      {
        "name": "_timesPerPeriod",
        "type": "uint256[4]"
      }
    ],
    "name": "changeSubcourtTimesPerPeriod",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_subcourtID",
        "type": "uint96"
      },
      {
        "name": "_feeForJuror",
        "type": "uint256"
      }
    ],
    "name": "changeSubcourtJurorFee",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_subcourtID",
        "type": "uint96"
      },
      {
        "name": "_alpha",
        "type": "uint256"
      }
    ],
    "name": "changeSubcourtAlpha",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "name": "_voteIDs",
        "type": "uint256[]"
      },
      {
        "name": "_commit",
        "type": "bytes32"
      }
    ],
    "name": "castCommit",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "RN",
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
    "name": "RNGenerator",
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
    "inputs": [
      {
        "name": "_destination",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      },
      {
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "executeGovernorProposal",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_minStakingTime",
        "type": "uint256"
      }
    ],
    "name": "changeMinStakingTime",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "NON_PAYABLE_AMOUNT",
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
        "name": "_subcourtID",
        "type": "uint96"
      },
      {
        "name": "_stake",
        "type": "uint128"
      }
    ],
    "name": "setStake",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      }
    ],
    "name": "executeRuling",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "name": "_appeal",
        "type": "uint256"
      },
      {
        "name": "_voteID",
        "type": "uint256"
      }
    ],
    "name": "getVote",
    "outputs": [
      {
        "name": "account",
        "type": "address"
      },
      {
        "name": "commit",
        "type": "bytes32"
      },
      {
        "name": "choice",
        "type": "uint256"
      },
      {
        "name": "voted",
        "type": "bool"
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
        "name": "_RNGenerator",
        "type": "address"
      }
    ],
    "name": "changeRNGenerator",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_iterations",
        "type": "uint256"
      }
    ],
    "name": "executeDelayedSetStakes",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_account",
        "type": "address"
      },
      {
        "name": "_subcourtID",
        "type": "uint96"
      }
    ],
    "name": "stakeOf",
    "outputs": [
      {
        "name": "stake",
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
        "name": "_subcourtID",
        "type": "uint96"
      },
      {
        "name": "_jurorsForCourtJump",
        "type": "uint256"
      }
    ],
    "name": "changeSubcourtJurorsForJump",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      }
    ],
    "name": "appealPeriod",
    "outputs": [
      {
        "name": "start",
        "type": "uint256"
      },
      {
        "name": "end",
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
    "name": "phase",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "MAX_STAKE_PATHS",
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
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "delayedSetStakes",
    "outputs": [
      {
        "name": "account",
        "type": "address"
      },
      {
        "name": "subcourtID",
        "type": "uint96"
      },
      {
        "name": "stake",
        "type": "uint128"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "lastPhaseChange",
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
    "name": "minStakingTime",
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
    "name": "nextDelayedSetStake",
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
        "name": "_numberOfChoices",
        "type": "uint256"
      },
      {
        "name": "_extraData",
        "type": "bytes"
      }
    ],
    "name": "createDispute",
    "outputs": [
      {
        "name": "disputeID",
        "type": "uint256"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "name": "_iterations",
        "type": "uint256"
      }
    ],
    "name": "drawJurors",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_parent",
        "type": "uint96"
      },
      {
        "name": "_hiddenVotes",
        "type": "bool"
      },
      {
        "name": "_minStake",
        "type": "uint256"
      },
      {
        "name": "_alpha",
        "type": "uint256"
      },
      {
        "name": "_feeForJuror",
        "type": "uint256"
      },
      {
        "name": "_jurorsForCourtJump",
        "type": "uint256"
      },
      {
        "name": "_timesPerPeriod",
        "type": "uint256[4]"
      },
      {
        "name": "_sortitionSumTreeK",
        "type": "uint256"
      }
    ],
    "name": "createSubcourt",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_account",
        "type": "address"
      }
    ],
    "name": "getJuror",
    "outputs": [
      {
        "name": "subcourtIDs",
        "type": "uint96[]"
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
        "name": "_owner",
        "type": "address"
      },
      {
        "name": "_spender",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "onApprove",
    "outputs": [
      {
        "name": "allowed",
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
        "name": "",
        "type": "address"
      }
    ],
    "name": "jurors",
    "outputs": [
      {
        "name": "stakedTokens",
        "type": "uint256"
      },
      {
        "name": "lockedTokens",
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
        "name": "_maxDrawingTime",
        "type": "uint256"
      }
    ],
    "name": "changeMaxDrawingTime",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      }
    ],
    "name": "getDispute",
    "outputs": [
      {
        "name": "votesLengths",
        "type": "uint256[]"
      },
      {
        "name": "tokensAtStakePerJuror",
        "type": "uint256[]"
      },
      {
        "name": "totalFeesForJurors",
        "type": "uint256[]"
      },
      {
        "name": "votesInEachRound",
        "type": "uint256[]"
      },
      {
        "name": "repartitionsInEachRound",
        "type": "uint256[]"
      },
      {
        "name": "penaltiesInEachRound",
        "type": "uint256[]"
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
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "name": "_appeal",
        "type": "uint256"
      }
    ],
    "name": "getVoteCounter",
    "outputs": [
      {
        "name": "winningChoice",
        "type": "uint256"
      },
      {
        "name": "counts",
        "type": "uint256[]"
      },
      {
        "name": "tied",
        "type": "bool"
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
        "name": "_governor",
        "type": "address"
      }
    ],
    "name": "changeGovernor",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "MIN_JURORS",
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
    "inputs": [
      {
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "name": "_extraData",
        "type": "bytes"
      }
    ],
    "name": "appealCost",
    "outputs": [
      {
        "name": "cost",
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
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "proxyPayment",
    "outputs": [
      {
        "name": "allowed",
        "type": "bool"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "lockInsolventTransfers",
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
        "name": "_extraData",
        "type": "bytes"
      }
    ],
    "name": "arbitrationCost",
    "outputs": [
      {
        "name": "cost",
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
    "name": "pinakion",
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
    "inputs": [
      {
        "name": "_governor",
        "type": "address"
      },
      {
        "name": "_pinakion",
        "type": "address"
      },
      {
        "name": "_RNGenerator",
        "type": "address"
      },
      {
        "name": "_minStakingTime",
        "type": "uint256"
      },
      {
        "name": "_maxDrawingTime",
        "type": "uint256"
      },
      {
        "name": "_hiddenVotes",
        "type": "bool"
      },
      {
        "name": "_minStake",
        "type": "uint256"
      },
      {
        "name": "_alpha",
        "type": "uint256"
      },
      {
        "name": "_feeForJuror",
        "type": "uint256"
      },
      {
        "name": "_jurorsForCourtJump",
        "type": "uint256"
      },
      {
        "name": "_timesPerPeriod",
        "type": "uint256[4]"
      },
      {
        "name": "_sortitionSumTreeK",
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
        "name": "_phase",
        "type": "uint8"
      }
    ],
    "name": "NewPhase",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_period",
        "type": "uint8"
      }
    ],
    "name": "NewPeriod",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_address",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_subcourtID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_stake",
        "type": "uint128"
      },
      {
        "indexed": false,
        "name": "_newTotalStake",
        "type": "uint256"
      }
    ],
    "name": "StakeSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_address",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_appeal",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_voteID",
        "type": "uint256"
      }
    ],
    "name": "Draw",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_address",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_tokenAmount",
        "type": "int256"
      },
      {
        "indexed": false,
        "name": "_ETHAmount",
        "type": "int256"
      }
    ],
    "name": "TokenAndETHShift",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "_arbitrable",
        "type": "address"
      }
    ],
    "name": "DisputeCreation",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "_arbitrable",
        "type": "address"
      }
    ],
    "name": "AppealPossible",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "_arbitrable",
        "type": "address"
      }
    ],
    "name": "AppealDecision",
    "type": "event"
  }
];

const yubiaiArbitrable = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "admin",
            type: "address"
          },
          {
            internalType: "uint32",
            name: "maxClaims",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "timeForReclaim",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "timeForChallenge",
            type: "uint32"
          },
          {
            internalType: "address",
            name: "ubiBurner",
            type: "address"
          },
          {
            internalType: "uint32",
            name: "adminFee",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "ubiFee",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "maxExtraFee",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "minTimeForService",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "maxTimeForService",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "minTimeForClaim",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "maxTimeForClaim",
            type: "uint32"
          }
        ],
        internalType: "struct Yubiai.YubiaiSettings",
        name: "_settings",
        type: "tuple"
      },
      {
        internalType: "address",
        name: "_governor",
        type: "address"
      },
      {
        internalType: "contract IArbitrator",
        name: "_arbitrator",
        type: "address"
      },
      {
        internalType: "bytes",
        name: "_extraData",
        type: "bytes"
      },
      {
        internalType: "string",
        name: "_metaEvidence",
        type: "string"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "claimId",
        type: "uint64"
      },
      {
        indexed: true,
        internalType: "enum Yubiai.ClaimResult",
        name: "result",
        type: "uint8"
      }
    ],
    name: "ClaimClosed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "dealId",
        type: "uint64"
      },
      {
        indexed: true,
        internalType: "uint64",
        name: "claimId",
        type: "uint64"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "string",
        name: "evidence",
        type: "string"
      }
    ],
    name: "ClaimCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_localDisputeID",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_round",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ruling",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_contributor",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      }
    ],
    name: "Contribution",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "dealId",
        type: "uint64"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "payment",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "refund",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ubiFee",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "adminFee",
        type: "uint256"
      }
    ],
    name: "DealClosed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "dealId",
        type: "uint64"
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          },
          {
            internalType: "address",
            name: "buyer",
            type: "address"
          },
          {
            internalType: "enum Yubiai.DealState",
            name: "state",
            type: "uint8"
          },
          {
            internalType: "uint32",
            name: "extraBurnFee",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "claimCount",
            type: "uint32"
          },
          {
            internalType: "uint24",
            name: "freeSpace",
            type: "uint24"
          },
          {
            internalType: "address",
            name: "seller",
            type: "address"
          },
          {
            internalType: "uint32",
            name: "createdAt",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "timeForService",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "timeForClaim",
            type: "uint32"
          },
          {
            internalType: "contract IERC20",
            name: "token",
            type: "address"
          },
          {
            internalType: "uint64",
            name: "currentClaim",
            type: "uint64"
          },
          {
            internalType: "uint32",
            name: "freeSpace2",
            type: "uint32"
          }
        ],
        indexed: false,
        internalType: "struct Yubiai.Deal",
        name: "deal",
        type: "tuple"
      },
      {
        indexed: false,
        internalType: "string",
        name: "terms",
        type: "string"
      }
    ],
    name: "DealCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IArbitrator",
        name: "_arbitrator",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_metaEvidenceID",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_evidenceGroupID",
        type: "uint256"
      }
    ],
    name: "Dispute",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IArbitrator",
        name: "_arbitrator",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_evidenceGroupID",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_party",
        type: "address"
      },
      {
        indexed: false,
        internalType: "string",
        name: "_evidence",
        type: "string"
      }
    ],
    name: "Evidence",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_metaEvidenceID",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "string",
        name: "_evidence",
        type: "string"
      }
    ],
    name: "MetaEvidence",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IArbitrator",
        name: "_arbitrator",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_ruling",
        type: "uint256"
      }
    ],
    name: "Ruling",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_localDisputeID",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_round",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_ruling",
        type: "uint256"
      }
    ],
    name: "RulingFunded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_localDisputeID",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_round",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_ruling",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_contributor",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_reward",
        type: "uint256"
      }
    ],
    name: "Withdrawal",
    type: "event"
  },
  {
    inputs: [],
    name: "VERSION",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_claimId",
        type: "uint64"
      }
    ],
    name: "acceptClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "arbitrator",
    outputs: [
      {
        internalType: "contract IArbitrator",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_claimId",
        type: "uint64"
      }
    ],
    name: "challengeClaim",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_governor",
        type: "address"
      }
    ],
    name: "changeGovernor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "admin",
            type: "address"
          },
          {
            internalType: "uint32",
            name: "maxClaims",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "timeForReclaim",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "timeForChallenge",
            type: "uint32"
          },
          {
            internalType: "address",
            name: "ubiBurner",
            type: "address"
          },
          {
            internalType: "uint32",
            name: "adminFee",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "ubiFee",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "maxExtraFee",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "minTimeForService",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "maxTimeForService",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "minTimeForClaim",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "maxTimeForClaim",
            type: "uint32"
          }
        ],
        internalType: "struct Yubiai.YubiaiSettings",
        name: "_settings",
        type: "tuple"
      }
    ],
    name: "changeSettings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    name: "claims",
    outputs: [
      {
        internalType: "uint256",
        name: "disputeId",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "arbFees",
        type: "uint256"
      },
      {
        internalType: "uint64",
        name: "dealId",
        type: "uint64"
      },
      {
        internalType: "uint32",
        name: "createdAt",
        type: "uint32"
      },
      {
        internalType: "uint32",
        name: "solvedAt",
        type: "uint32"
      },
      {
        internalType: "uint8",
        name: "ruling",
        type: "uint8"
      },
      {
        internalType: "uint64",
        name: "arbSettingsId",
        type: "uint64"
      },
      {
        internalType: "uint56",
        name: "freeSpace",
        type: "uint56"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_dealId",
        type: "uint64"
      }
    ],
    name: "closeDeal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "counters",
    outputs: [
      {
        internalType: "uint64",
        name: "dealCount",
        type: "uint64"
      },
      {
        internalType: "uint64",
        name: "claimCount",
        type: "uint64"
      },
      {
        internalType: "uint64",
        name: "currentArbSettingId",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          },
          {
            internalType: "address",
            name: "buyer",
            type: "address"
          },
          {
            internalType: "enum Yubiai.DealState",
            name: "state",
            type: "uint8"
          },
          {
            internalType: "uint32",
            name: "extraBurnFee",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "claimCount",
            type: "uint32"
          },
          {
            internalType: "uint24",
            name: "freeSpace",
            type: "uint24"
          },
          {
            internalType: "address",
            name: "seller",
            type: "address"
          },
          {
            internalType: "uint32",
            name: "createdAt",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "timeForService",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "timeForClaim",
            type: "uint32"
          },
          {
            internalType: "contract IERC20",
            name: "token",
            type: "address"
          },
          {
            internalType: "uint64",
            name: "currentClaim",
            type: "uint64"
          },
          {
            internalType: "uint32",
            name: "freeSpace2",
            type: "uint32"
          }
        ],
        internalType: "struct Yubiai.Deal",
        name: "_deal",
        type: "tuple"
      },
      {
        internalType: "string",
        name: "_terms",
        type: "string"
      }
    ],
    name: "createDeal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          },
          {
            internalType: "address",
            name: "buyer",
            type: "address"
          },
          {
            internalType: "enum Yubiai.DealState",
            name: "state",
            type: "uint8"
          },
          {
            internalType: "uint32",
            name: "extraBurnFee",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "claimCount",
            type: "uint32"
          },
          {
            internalType: "uint24",
            name: "freeSpace",
            type: "uint24"
          },
          {
            internalType: "address",
            name: "seller",
            type: "address"
          },
          {
            internalType: "uint32",
            name: "createdAt",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "timeForService",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "timeForClaim",
            type: "uint32"
          },
          {
            internalType: "contract IERC20",
            name: "token",
            type: "address"
          },
          {
            internalType: "uint64",
            name: "currentClaim",
            type: "uint64"
          },
          {
            internalType: "uint32",
            name: "freeSpace2",
            type: "uint32"
          }
        ],
        internalType: "struct Yubiai.Deal",
        name: "_deal",
        type: "tuple"
      },
      {
        internalType: "string",
        name: "_terms",
        type: "string"
      }
    ],
    name: "createDealWithValue",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    name: "deals",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "buyer",
        type: "address"
      },
      {
        internalType: "enum Yubiai.DealState",
        name: "state",
        type: "uint8"
      },
      {
        internalType: "uint32",
        name: "extraBurnFee",
        type: "uint32"
      },
      {
        internalType: "uint32",
        name: "claimCount",
        type: "uint32"
      },
      {
        internalType: "uint24",
        name: "freeSpace",
        type: "uint24"
      },
      {
        internalType: "address",
        name: "seller",
        type: "address"
      },
      {
        internalType: "uint32",
        name: "createdAt",
        type: "uint32"
      },
      {
        internalType: "uint32",
        name: "timeForService",
        type: "uint32"
      },
      {
        internalType: "uint32",
        name: "timeForClaim",
        type: "uint32"
      },
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address"
      },
      {
        internalType: "uint64",
        name: "currentClaim",
        type: "uint64"
      },
      {
        internalType: "uint32",
        name: "freeSpace2",
        type: "uint32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "disputeIdToClaim",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_externalDisputeID",
        type: "uint256"
      }
    ],
    name: "externalIDtoLocalID",
    outputs: [
      {
        internalType: "uint256",
        name: "localDisputeID",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    name: "extraDatas",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_claimId",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_ruling",
        type: "uint256"
      }
    ],
    name: "fundAppeal",
    outputs: [
      {
        internalType: "bool",
        name: "fullyFunded",
        type: "bool"
      }
    ],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "getMultipliers",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_claimId",
        type: "uint256"
      },
      {
        internalType: "address payable",
        name: "_beneficiary",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_contributedTo",
        type: "uint256"
      }
    ],
    name: "getTotalWithdrawableAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "sum",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "governor",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_dealId",
        type: "uint64"
      }
    ],
    name: "isOver",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_dealId",
        type: "uint64"
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "_evidence",
        type: "string"
      }
    ],
    name: "makeClaim",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_extraData",
        type: "bytes"
      },
      {
        internalType: "string",
        name: "_metaEvidence",
        type: "string"
      }
    ],
    name: "newArbSettings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "numberOfRulingOptions",
    outputs: [
      {
        internalType: "uint256",
        name: "count",
        type: "uint256"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_disputeId",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_ruling",
        type: "uint256"
      }
    ],
    name: "rule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_token",
        type: "address"
      },
      {
        internalType: "bool",
        name: "_validity",
        type: "bool"
      }
    ],
    name: "setTokenValidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "settings",
    outputs: [
      {
        internalType: "address",
        name: "admin",
        type: "address"
      },
      {
        internalType: "uint32",
        name: "maxClaims",
        type: "uint32"
      },
      {
        internalType: "uint32",
        name: "timeForReclaim",
        type: "uint32"
      },
      {
        internalType: "uint32",
        name: "timeForChallenge",
        type: "uint32"
      },
      {
        internalType: "address",
        name: "ubiBurner",
        type: "address"
      },
      {
        internalType: "uint32",
        name: "adminFee",
        type: "uint32"
      },
      {
        internalType: "uint32",
        name: "ubiFee",
        type: "uint32"
      },
      {
        internalType: "uint32",
        name: "maxExtraFee",
        type: "uint32"
      },
      {
        internalType: "uint32",
        name: "minTimeForService",
        type: "uint32"
      },
      {
        internalType: "uint32",
        name: "maxTimeForService",
        type: "uint32"
      },
      {
        internalType: "uint32",
        name: "minTimeForClaim",
        type: "uint32"
      },
      {
        internalType: "uint32",
        name: "maxTimeForClaim",
        type: "uint32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_claimId",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "_evidenceURI",
        type: "string"
      }
    ],
    name: "submitEvidence",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address"
      }
    ],
    name: "tokenValidity",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_claimId",
        type: "uint256"
      },
      {
        internalType: "address payable",
        name: "_beneficiary",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_round",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_ruling",
        type: "uint256"
      }
    ],
    name: "withdrawFeesAndRewards",
    outputs: [
      {
        internalType: "uint256",
        name: "reward",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_claimId",
        type: "uint256"
      },
      {
        internalType: "address payable",
        name: "_beneficiary",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_contributedTo",
        type: "uint256"
      }
    ],
    name: "withdrawFeesAndRewardsForAllRounds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const yubiaiArbitrator = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "contract IArbitrable",
        name: "_arbitrable",
        type: "address"
      }
    ],
    name: "AppealDecision",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "contract IArbitrable",
        name: "_arbitrable",
        type: "address"
      }
    ],
    name: "AppealPossible",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "contract IArbitrable",
        name: "_arbitrable",
        type: "address"
      }
    ],
    name: "DisputeCreation",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "_extraData",
        type: "bytes"
      }
    ],
    name: "appeal",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    name: "appealCost",
    outputs: [
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256"
      }
    ],
    name: "appealPeriod",
    outputs: [
      {
        internalType: "uint256",
        name: "start",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "end",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    name: "arbitrationCost",
    outputs: [
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_choices",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "_extraData",
        type: "bytes"
      }
    ],
    name: "createDispute",
    outputs: [
      {
        internalType: "uint256",
        name: "disputeID",
        type: "uint256"
      }
    ],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256"
      }
    ],
    name: "currentRuling",
    outputs: [
      {
        internalType: "uint256",
        name: "ruling",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256"
      }
    ],
    name: "disputeStatus",
    outputs: [
      {
        internalType: "enum IArbitrator.DisputeStatus",
        name: "status",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "disputes",
    outputs: [
      {
        internalType: "contract IArbitrable",
        name: "arbitrated",
        type: "address"
      },
      {
        internalType: "uint8",
        name: "numberOfRulingOptions",
        type: "uint8"
      },
      {
        internalType: "uint8",
        name: "ruling",
        type: "uint8"
      },
      {
        internalType: "enum IArbitrator.DisputeStatus",
        name: "status",
        type: "uint8"
      },
      {
        internalType: "uint32",
        name: "appealDeadline",
        type: "uint32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256"
      }
    ],
    name: "executeRuling",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256"
      },
      {
        internalType: "uint8",
        name: "_ruling",
        type: "uint8"
      },
      {
        internalType: "uint32",
        name: "_appealWindow",
        type: "uint32"
      }
    ],
    name: "giveRuling",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "governor",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_arbitrationPrice",
        type: "uint256"
      }
    ],
    name: "setArbitrationPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

module.exports = { erc20, arbitrator, yubiaiArbitrable, yubiaiArbitrator};