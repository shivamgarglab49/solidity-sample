import { Client, ContractFunctionParameters } from "@hashgraph/sdk";

export const SUPPORTED_CONTRACTS = ["CounterContract"];

export const EMPTY_CONTRACT_PARAMS = new ContractFunctionParameters();

const ADMIN_ACCOUNT_ID = "0.0.48769861";
const ADMIN_ACCOUNT_P_KEY =
  "c8cb72a0addffcbd898689e5b5641c0abff4399ddeb90a04071433e3724e14dd";

//// #################### admin account details start ###################### ////
export const admin = {
  ADMIN_ACCOUNT_ID,
  ADMIN_ACCOUNT_P_KEY,
};

export const admin_client = Client.forTestnet().setOperator(
  admin.ADMIN_ACCOUNT_ID,
  admin.ADMIN_ACCOUNT_P_KEY
);

//// #################### admin account details end ###################### ////
