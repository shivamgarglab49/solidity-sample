import {
  AccountId,
  ContractCallQuery,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  Hbar,
  PrivateKey,
  AccountCreateTransaction,
} from "@hashgraph/sdk";
import { BigNumber } from "../node_modules/bignumber.js/bignumber";

import { admin, user1, user2 } from "../helpers/Constants";

// 0000000000000000000000000000000002e97f53
class TokenCreator {
  private static _GAS_AMOUNT = 1000000;
  private static _DEALLOT_TOKEN_COUNT = new BigNumber(5);
  private constructor() {}

  /**
   *
   * @param contractId
   * @param serviceAddress
   * @returns
   */
  static async run(
    contractId: string,
    serviceAddress: string,
    senderAddress: string,
    receiverAddress: string
  ) {
    return new TokenCreator().run(
      contractId,
      serviceAddress,
      senderAddress,
      receiverAddress
    );
  }

  /**
   *
   * @param contractId
   * @param serviceAddress
   * @returns
   */
  private async run(
    contractId: string,
    serviceAddress: string,
    senderAddress: string,
    receiverAddress: string
  ) {
    return {
      // initialize: await this.initialize(contractId, serviceAddress),
      tokenAddress: await this.fetchTokenAddress(contractId),
      tokenCount_1: await this.fetchTokenCount(contractId),
      //miniT: await this.mintT(contractId, 50),
      // tokenCount1: await this.fetchTokenCount(contractId),
      // assosiateT: await this.assosiateT(contractId),
      // transferT: await this.transferT(contractId),
      // tokenCount2: await this.fetchTokenCount(contractId),
      // allocate: await this.allocateToken(contractId),
      user_B_1: await this.fetchBalanceOf(contractId, user1.idObject),
      // deallocate: await this.deallocateToken(contractId),
      user_B_2: await this.fetchBalanceOf(contractId, user1.idObject),
      // tokenCount_2: await this.fetchTokenCount(contractId),
      // totalSupply: await this.fetchBalanceOf(
      //   contractId,
      //   "0000000000000000000000000000000002e97f33"
      // ),
      // allocateCode: await this.allocateToken(contractId, user2.idObject),
      // deallocateCode: await this.deallocateToken(contractId, senderAddress),
    };
  }

  /**
   *
   * @param contractId
   * @returns
   */
  private async initialize(contractId: string, serviceAddress: string) {
    const args = new ContractFunctionParameters().addAddress(serviceAddress);
    const txn = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(TokenCreator._GAS_AMOUNT)
      .setPayableAmount(new Hbar(60))
      .setFunction("initialize", args);
    const txnResponse = await txn.execute(admin.client);
    const txnResponseR = await txnResponse.getRecord(admin.client);
    return txnResponseR.contractFunctionResult!.getInt256(0);
  }

  /**
   *
   * @param contractId
   * @param accountAddress
   */
  private async fetchBalanceOf(contractId: string, accountAddress: string) {
    const args = new ContractFunctionParameters().addAddress(accountAddress);
    const txn = new ContractCallQuery()
      .setContractId(contractId)
      .setGas(100000)
      .setFunction("fetchBalanceOf", args);
    const txnResponse = await txn.execute(admin.client);
    return txnResponse.getInt256(0);
  }

  // /**
  //  *
  //  * @param contractId
  //  * @param accountAddress
  //  */
  // private async fetchBalanceOf(contractId: string, accountAddress: string) {
  //   const args = new ContractFunctionParameters().addAddress(accountAddress);
  //   const txn = new ContractExecuteTransaction()
  //     .setContractId(contractId)
  //     .setGas(100000)
  //     .setFunction("fetchBalanceOf", args);
  //   const txnResponse = await txn.execute(admin.client);
  //   const txnResponseR = await txnResponse.getRecord(admin.client);
  //   return txnResponseR.contractFunctionResult!.getInt256(0).c![0];
  // }

  /**
   *
   * @param contractId
   */
  private async fetchTokenAddress(contractId: string) {
    const txn = new ContractCallQuery()
      .setContractId(contractId)
      .setGas(100000)
      .setFunction("fetchTokenAddress");
    const txnResponse = await txn.execute(admin.client);
    return txnResponse.getAddress(0);
  }

  /**
   *
   * @param contractId
   */
  private async fetchTokenCount(contractId: string) {
    const txn = new ContractCallQuery()
      .setContractId(contractId)
      .setGas(100000)
      .setFunction("fetchTokenCount");
    const txnResponse = await txn.execute(admin.client);
    return txnResponse.getUint256(0).c![0];
  }

  /**
   *
   * @param contractId
   * @param receiverAddress
   * @param count
   * @returns
   */
  private async mintT(contractId: string, count: number) {
    const tokenCount = new BigNumber(count);
    const args = new ContractFunctionParameters().addInt256(tokenCount);
    const txn = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction("mintT", args);

    const txnResponse = await txn.execute(admin.client);
    const createTokenRx = await txnResponse.getRecord(admin.client);
    return {
      mintedTokenCount: count,
      status: createTokenRx.contractFunctionResult?.getInt256(0).c![0],
    };
  }

  private async assosiateT(contractId: string) {
    const args = new ContractFunctionParameters().addAddress(user1.idObject);
    const txn = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction("assosiateT", args)
      .freezeWith(admin.client)
      .sign(user1.privateKeyObject);

    const txnResponse = await txn.execute(admin.client);
    const createTokenRx = await txnResponse.getRecord(admin.client);
    return createTokenRx.contractFunctionResult?.getInt256(0).c![0];
  }

  private async transferT(contractId: string) {
    const args = new ContractFunctionParameters()
      .addAddress(user1.idObject)
      .addInt256(new BigNumber(10));
    const txn = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction("transferT", args);
    const txnResponse = await txn.execute(admin.client);
    const createTokenRx = await txnResponse.getRecord(admin.client);
    return createTokenRx.contractFunctionResult?.getInt256(0).c![0];
  }

  /**
   *
   * @param contractId
   * @returns
   */
  private async allocateToken(contractId: string) {
    const args = new ContractFunctionParameters()
      .addAddress(user1.idObject)
      .addInt256(new BigNumber(45));

    const txn = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction("allocateToken", args)
      .freezeWith(admin.client)
      .sign(user1.privateKeyObject);

    const txnResponse = await txn.execute(admin.client);
    const createTokenRx = await txnResponse.getRecord(admin.client);
    return createTokenRx.contractFunctionResult?.getInt256(0).c![0];
  }

  /**
   *
   * @param contractId
   * @param senderAddress
   * @param count
   * @returns
   */
  private async deallocateToken(contractId: string) {
    const args = new ContractFunctionParameters()
      .addAddress(user1.idObject)
      .addInt256(new BigNumber(1));
    const txn = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction("deallocateToken", args)
      .freezeWith(admin.client)
      .sign(user1.privateKeyObject);
    const txnResponse = await txn.execute(admin.client);
    const createTokenRx = await txnResponse.getRecord(admin.client);
    return createTokenRx.contractFunctionResult?.getInt256(0).c![0];
  }

  // Account creation function
  private async accountCreator(pvKey: PrivateKey, iBal: number) {
    const response = await new AccountCreateTransaction()
      .setInitialBalance(new Hbar(iBal))
      .setKey(pvKey.publicKey)
      .execute(user1.client);
    const receipt = await response.getReceipt(user1.client);
    return receipt.accountId!;
  }
}

const contractId = "0.0.48857359";
const serviceAddress = "0000000000000000000000000000000002e97f33";
const receiverAddress = "";
const senderAddress = "";
TokenCreator.run(contractId, serviceAddress, receiverAddress, senderAddress) // using orignal contract id (this took from ==> output/contracts.json)
  .then((response) => console.log(response))
  .catch((err) => console.error(err))
  .finally(() => process.exit(0));
