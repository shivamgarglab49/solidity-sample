import {
  ContractCallQuery,
  ContractExecuteTransaction,
  ContractFunctionParameters,
} from "@hashgraph/sdk";

import { user1 } from "../helpers/Constants";

class CounterContract {
  private constructor() {}

  /**
   *
   * @param contractId
   * @returns
   */
  static async run(contractId: string) {
    return new CounterContract().run(contractId);
  }
  /**
   *
   * @param contractId
   * @returns
   */
  private async run(contractId: string) {
    const firstRead = await this.counter(contractId);
    await this.initialize(contractId, 1000);
    const bwRead = await this.counter(contractId);
    await this.increment(contractId);
    await this.increment(contractId);
    await this.increment(contractId);
    await this.decrement(contractId);
    const lastRead = await this.counter(contractId);
    return { firstRead, bwRead, lastRead };
  }

  private async increment(contractId: string) {
    const txn = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(300000)
      .setFunction("increment");
    await txn.execute(user1.client);
  }

  /**
   *
   * @param contractId
   * @returns
   */
  private async decrement(contractId: string) {
    const txn = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(300000)
      .setFunction("decrement");
    await txn.execute(user1.client);
  }

  /**
   *
   * @param contractId
   * @returns
   */
  private async initialize(contractId: string, initValue: number) {
    const args = new ContractFunctionParameters().addUint256(initValue);
    const txn = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(300000)
      .setFunction("initialize", args);
    await txn.execute(user1.client);
  }

  /**
   *
   * @param contractId
   * @returns
   */
  private async counter(contractId: string) {
    const txn = new ContractCallQuery()
      .setContractId(contractId)
      .setGas(300000)
      .setFunction("counter");
    const txnResponse = await txn.execute(user1.client);
    return txnResponse.getUint256(0);
  }
}

CounterContract.run("0.0.48847486") // using proxy contract id (this took from ==> output/contracts.json)
  .then((response) => console.log(response))
  .catch((err) => console.error(err))
  .finally(() => process.exit(0));
