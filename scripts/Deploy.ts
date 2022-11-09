import { ContractFunctionParameters } from "@hashgraph/sdk";
import * as LocalFileConfig from "../model/SaveFileConfig";
import { SUPPORTED_CONTRACTS, admin } from "../helpers/Constants";
import { Helper } from "../helpers/Helper";

async function main() {
  const { sourcePaths } = Helper.getContractPathList();
  if (sourcePaths.length == 0) {
    console.error("No contract found");
    process.exit(0);
  }
  const execSync = require("child_process").execSync;
  execSync("npx hardhat clean"); // cleaning artifact folder
  execSync("npx hardhat compile"); // building artifact folder
  const { compiledPaths } = Helper.getContractPathList();
  if (compiledPaths.length == 0) {
    console.error("No compiled contract found");
    process.exit(0);
  }
  const contractJsonList = compiledPaths
    .filter((path) => {
      return SUPPORTED_CONTRACTS.includes(Helper.getFileNameFromPath(path));
    })
    .map((path) => Helper.readFileContent(path));
  console.log(
    "Contract Names => ",
    contractJsonList.map((item) => item.contractName)
  );

  if (contractJsonList.length != 2) {
    console.error(
      "at this stage, we shoule have the logic contract and proxy contract into bucket"
    );
    process.exit(0);
  }
  const [transparentUpgradeableProxyContractObj, counterContractObj] =
    contractJsonList;

  // this is the two step process
  // step1 publish contract
  const response = await new Helper().saveContractOnHedera(
    admin.client,
    counterContractObj,
    admin.privateKeyObject,
    8_00_000,
    LocalFileConfig.default_save_file_config
  );

  // step2 publish proxy now
  const contractFunctionParams = new ContractFunctionParameters()
    .addAddress(response.address)
    .addAddress(admin.idObject)
    .addBytes(new Uint8Array());

  const response1 = await new Helper().saveContractOnHedera(
    admin.client,
    transparentUpgradeableProxyContractObj,
    admin.privateKeyObject,
    8_00_000,
    LocalFileConfig.default_save_file_config,
    contractFunctionParams
  );
  return { response, response1 };
}

main()
  .then((response) => console.log(response))
  .catch((e) => console.error(e))
  .finally(() => process.exit(0));
