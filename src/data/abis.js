
const abis = [
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
      }
];

module.exports = abis;