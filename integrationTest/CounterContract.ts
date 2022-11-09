import { ContractCallQuery, ContractExecuteTransaction } from "@hashgraph/sdk";

import { admin_client as client } from "../helpers/Constants";

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
    await this.increment(contractId);
    await this.increment(contractId);
    await this.increment(contractId);
    await this.decrement(contractId);
    const lastRead = await this.counter(contractId);
    return { firstRead: firstRead.c![0], lastRead: lastRead.c![0] };
  }

  private async increment(contractId: string) {
    const txn = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(300000)
      .setFunction("increment");
    await txn.execute(client);
  }

  /**
   *
   * @param contractId
   * @returns
   */
  private async decrement(contractId: string) {
    const txn = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(26409)
      .setFunction("decrement");
    await txn.execute(client);
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
    const txnResponse = await txn.execute(client);
    return txnResponse.getUint256(0);
  }
}

CounterContract.run("0.0.48847048") // using original contract id (this took from ==> output/contracts.json)
  .then((response) => console.log(response))
  .catch((err) => console.error(err))
  .finally(() => process.exit(0));
