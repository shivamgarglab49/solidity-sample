import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

// Test suit
describe("CounterContract suite", async () => {
  // The first time loadFixture is called, the fixture methos is executed
  // But the second time, instead of executing the fixture again, loadFixture will reset the state of the network to the point where it was right after the fixture was executed.
  // This is faster, and it undoes any state changes done by the previous test.
  // for proof, we can have one log statment which will be executed only once for this test suite
  const fixture = async () => {
    const Contract = await ethers.getContractFactory("CounterContract");
    const instance = await Contract.deploy();
    return instance;
  };

  it("testing increment function", async () => {
    const instance = await loadFixture(fixture);
    await instance.increment();
    expect(await instance.counter()).to.equals(1);
  });

  it("testing decrement function", async () => {
    const instance = await loadFixture(fixture);
    await instance.increment();
    await instance.increment();
    await instance.increment();
    await instance.decrement();
    expect(await instance.counter()).to.equals(2);
  });
});
