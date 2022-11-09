import {
  Client,
  ContractFunctionParameters,
  AccountId,
  PrivateKey,
} from "@hashgraph/sdk";

export const TransparentUpgradeableProxy = "TransparentUpgradeableProxy";

export const SUPPORTED_CONTRACTS = [
  "CounterContract",
  // TransparentUpgradeableProxy,
];

export const EMPTY_CONTRACT_PARAMS = new ContractFunctionParameters();

//// #################### admin account details start ###################### ////

const ADMIN_ACCOUNT_ID = "0.0.48769861";
const ADMIN_ACCOUNT_P_KEY =
  "c8cb72a0addffcbd898689e5b5641c0abff4399ddeb90a04071433e3724e14dd";

export const admin = {
  id: ADMIN_ACCOUNT_ID,
  idObject: AccountId.fromString(ADMIN_ACCOUNT_ID).toSolidityAddress(),
  privateKey: ADMIN_ACCOUNT_P_KEY,
  privateKeyObject: PrivateKey.fromString(ADMIN_ACCOUNT_P_KEY),
  client: Client.forTestnet().setOperator(
    ADMIN_ACCOUNT_ID,
    ADMIN_ACCOUNT_P_KEY
  ),
};

//// #################### admin account details end ###################### ////

//// #################### user 1 account details start ###################### ////

const USER_1_ACCOUNT_ID = "0.0.47710057";
const USER_1_ACCOUNT_P_KEY =
  "3030020100300706052b8104000a04220420d38b0ed5f11f8985cd72c8e52c206b512541c6f301ddc9d18bd8b8b25a41a80f";

export const user1 = {
  id: USER_1_ACCOUNT_ID,
  idObject: AccountId.fromString(USER_1_ACCOUNT_ID).toSolidityAddress(),
  privateKey: USER_1_ACCOUNT_P_KEY,
  privateKeyObject: PrivateKey.fromString(USER_1_ACCOUNT_P_KEY),
  client: Client.forTestnet().setOperator(
    USER_1_ACCOUNT_ID,
    USER_1_ACCOUNT_P_KEY
  ),
};

//// #################### user 1 account details end ###################### ////
