import * as LocalFileConfig from "../model/SaveFileConfig";
import { SUPPORTED_CONTRACTS, admin } from "../helpers/Constants";
import { Helper } from "../helpers/Helper";

async function main() {
  const { compiledPaths, sourcePaths } = Helper.getContractPathList();
  if (compiledPaths.length == 0) {
    console.error("No compiled contract found");
    process.exit(0);
  }
  if (sourcePaths.length == 0) {
    console.error("No contract found");
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
  if (contractJsonList.length == 0) {
    console.error("No supported contract exist");
    process.exit(0);
  }
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
