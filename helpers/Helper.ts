import * as fs from "fs-extra";
import * as LocalFileConfig from "../model/SaveFileConfig";
import { EMPTY_CONTRACT_PARAMS } from "./Constants";
import { getAllFilesSync } from "get-all-files";
import {
  ContractCreateFlow,
  Client,
  PrivateKey,
  ContractFunctionParameters,
} from "@hashgraph/sdk";

export class Helper {
  private _default_gas_amount: number = 1_00_000;

  /**
   * save contract on hedera network
   * @param client
   * @param dataObject json dataObject from .json file as string
   * @param signingKey key which will sign the txn
   * @param gas default 1_00_000, client can pass different amount if required
   * @param saveFileConfig default is null, passing configuration object for other task
   * @param contractFunctionParams contarct constructor params
   * @returns
   */
  public async saveContractOnHedera(
    client: Client,
    dataObject: any,
    signingKey: PrivateKey,
    gas: number | Long = this._default_gas_amount,
    saveFileConfig: LocalFileConfig.SaveFileConfig | null = null,
    contractFunctionParams: ContractFunctionParameters = EMPTY_CONTRACT_PARAMS
  ) {
    // data as object
    if (
      dataObject == null ||
      dataObject.bytecode == null ||
      dataObject.contractName == null
    ) {
      throw Error("data parsing error inside saveContractOnHedera()");
    }
    const contractCreateTxn = new ContractCreateFlow()
      .setConstructorParameters(contractFunctionParams)
      .setBytecode(dataObject.bytecode)
      .setGas(gas)
      .setAdminKey(signingKey)
      .setContractMemo("saveContractOnHedera method used")
      .sign(signingKey);

    const txnResponse = await contractCreateTxn.execute(client);
    const txnReceipt = await txnResponse.getReceipt(client);
    const contractId = txnReceipt.contractId;

    // contract id should not be null
    if (contractId == null) {
      throw Error("contractId is null inside saveContractOnHedera()");
    }
    const response = {
      contractId: contractId.toString(),
      address: contractId.toSolidityAddress(),
      savedLocally: false,
    };
    if (saveFileConfig != null && saveFileConfig.enabled) {
      // saving data locally
      this.saveFileLocally(
        saveFileConfig,
        contractId.toString(),
        dataObject.contractName,
        contractId.toSolidityAddress()
      );
      response.savedLocally = true;
    }
    return response;
  }
  /**
   *
   * @param saveFileConfig
   * @param contractId
   * @param contractName
   * @param contractAddress
   */
  private saveFileLocally = (
    saveFileConfig: LocalFileConfig.SaveFileConfig,
    contractId: string,
    contractName: string,
    contractAddress: string
  ) => {
    const savedItems = this.getSavedContractsModelList(saveFileConfig.path);
    const newItem: FileModel = {
      contractName: contractName,
      contractId: contractId,
      contractAddress: "0x" + contractAddress,
      timestamp: new Date().toISOString(),
    };
    const finalItems = [...savedItems, newItem];
    fs.outputFileSync(saveFileConfig.path, JSON.stringify(finalItems, null, 4));
  };

  /**
   *
   * @param filePath
   * @returns
   */
  private getSavedContractsModelList = (filePath: string): [FileModel] => {
    return Helper.readFileContent(filePath) || [];
  };

  /**
   *
   * @param filePath
   * @returns
   */
  static readFileContent = (filePath: string): any | null => {
    try {
      fs.ensureFileSync(filePath);
      return JSON.parse(fs.readFileSync(filePath) as any);
    } catch (error) {
      return null;
    }
  };

  static getFileNameFromPath(path: string): string {
    return path.split("/").at(-1)?.split(".")[0] || "";
  }

  static getContractPathList() {
    const info: {
      compiledPaths: Array<string>;
      sourcePaths: Array<string>;
    } = {
      compiledPaths: [],
      sourcePaths: [],
    };

    // checking if we have contracts available
    try {
      info.sourcePaths = getAllFilesSync("./contracts")
        .toArray()
        .filter((path) => {
          return path.includes(".sol");
        });
    } catch (e) {
      info.sourcePaths = [];
    }

    // reading compiled path to get json files
    try {
      info.compiledPaths = getAllFilesSync("./artifacts")
        .toArray()
        .filter((path) => {
          return (
            path.includes(".sol") &&
            !path.includes(".dbg") &&
            path.endsWith(".json")
          );
        });
    } catch (e) {
      info.compiledPaths = [];
    }
    return info;
  }
}
