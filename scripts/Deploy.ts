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

  const [counterContractObj] = contractJsonList;
  const response = await new Helper().saveContractOnHedera(
    admin.client,
    counterContractObj,
    admin.privateKeyObject,
    8_00_000,
    LocalFileConfig.default_save_file_config
  );
  return { response };
}

main()
  .then((response) => console.log(response))
  .catch((e) => console.error(e))
  .finally(() => process.exit(0));
