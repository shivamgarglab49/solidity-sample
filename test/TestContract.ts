import { ethers } from "hardhat";
import { expect } from "chai";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

// Test suit
describe("TestContract suit", async () => {
  // The first time loadFixture is called, the fixture methos is executed
  // But the second time, instead of executing the fixture again, loadFixture will reset the state of the network to the point where it was right after the fixture was executed.
  // This is faster, and it undoes any state changes done by the previous test.
  // for proof, we can have one log statment which will be executed only once for this test suite
  const fixture = async () => {
    const Contract = await ethers.getContractFactory("TestContract");
    const instance = await Contract.deploy();
    return instance;
  };

  it("testing UserNameRead event", async () => {
    const instance = await loadFixture(fixture);
    await expect(instance.getUserName()).to.emit(instance, "UserNameRead");
  });

  it("testing UserNameUpdated event", async () => {
    const instance = await loadFixture(fixture);
    await expect(instance.setUserName("A"))
      .to.emit(instance, "UserNameUpdated")
      .withArgs("A");
  });

  it("testing UserNameUpdatedWithCount with any agrument support", async () => {
    const instance = await loadFixture(fixture);
    await expect(instance.setUserNameWithCount("A", 10))
      .to.emit(instance, "UserNameUpdatedWithCount")
      .withArgs(anyValue, 10);
  });

  it("testing setName when passing empty string", async () => {
    const instance = await loadFixture(fixture);
    await expect(instance.setName("")).to.be.reverted;
  });

  it("testing setName when passing non-empty string", async () => {
    const instance = await loadFixture(fixture);
    await expect(instance.setName("A")).to.be.not.reverted;
  });

  it("testing setName when passing empty string", async () => {
    const instance = await loadFixture(fixture);
    await expect(instance.setName("")).to.be.revertedWith(
      "newUserName can not be empty"
    );
  });

  it("testing getNumber10", async () => {
    const instance = await loadFixture(fixture);
    expect(await instance.getNumber10()).to.equal(10);
  });
});
