const { expect } = require("chai");

describe("USDTz", function () {
    it("Should mint 1 000 000 to deployer (18 decimals)", async function () {
        const [acc] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("USDTz");
        const tok = await Token.deploy("USDT.z", "USDTz", 18, 1_000_000);
        await tok.waitForDeployment();

        const bal = await tok.balanceOf(acc.address);
        expect(bal).to.equal(ethers.parseUnits("1000000", 18));
    });

    it("Owner can mint extra", async function () {
        const [acc, user] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("USDTz");
        const tok = await Token.deploy("USDT.z", "USDTz", 18, 1_000_000);
        await tok.waitForDeployment();

        await tok.mint(user.address, ethers.parseUnits("500000", 18));
        const bal = await tok.balanceOf(user.address);
        expect(bal).to.equal(ethers.parseUnits("500000", 18));
    });
});
