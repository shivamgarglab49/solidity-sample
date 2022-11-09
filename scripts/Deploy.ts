import { PrivateKey } from "@hashgraph/sdk";
import * as LocalFileConfig from "../model/SaveFileConfig";
import * as Constant from "../helpers/Constants";
import { Helper } from "../helpers/Helper";

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
    return Constant.SUPPORTED_CONTRACTS.includes(
      Helper.getFileNameFromPath(path)
    );
  })
  .map((path) => Helper.readFileContent(path));
console.log(
  "Contract Names => ",
  contractJsonList.map((item) => item.contractName)
);
let totalContracts = contractJsonList.length;
contractJsonList.map((eachItem) => {
  new Helper()
    .saveContractOnHedera(
      Constant.admin_client,
      eachItem,
      PrivateKey.fromString(Constant.admin.ADMIN_ACCOUNT_P_KEY),
      8_00_000,
      LocalFileConfig.default_save_file_config
    )
    .then((response) => console.log(response))
    .catch((e) => console.error(e))
    .finally(() => {
      totalContracts -= 1;
      if (totalContracts == 0) {
        process.exit(0);
      }
    });
});
