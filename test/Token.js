const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

//owner pub address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
const owner = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", ethers.provider);
const ownerAddress = owner.address;
const gasInfo = { gasPrice: 90000000000, gasLimit: 5000000 };
//user1 address: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
const user1 = new ethers.Wallet("0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a", ethers.provider);
//user2 address: 0x90F79bf6EB2c4f870365E785982E1f101E93b906
const user2 = new ethers.Wallet("0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6", ethers.provider);

//user3 address: 0x976EA74026E726554dB657fA54763abd0C3a0aa9
const user3 = new ethers.Wallet("0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e", ethers.provider);

const initialSupply = 69420000000000;

describe("Token contract", function(){
    async function deployContractsFixture() {

        const initialSupply = 69420000000000;
        const MemeToken = await hre.ethers.getContractFactory("Token");
        const MemeTokenDe = await MemeToken.deploy(initialSupply, "StarBase", "ST", ownerAddress, gasInfo);
        console.log("MemeToken deployed at:", MemeTokenDe.target);

        const TokenClaim = await hre.ethers.getContractFactory("TokenClaim");
        const ClaimDe = await TokenClaim.deploy(MemeTokenDe.target, ownerAddress);
        console.log("TokenClaim deployed at:", ClaimDe.target);
        return [MemeTokenDe, ClaimDe];
    }

    it("Should owner balance equals initialSupplay", async function(){
        const [Token, Claim] = await loadFixture(deployContractsFixture);
        const ownerBalance = await Token.balanceOf(owner.address);
        console.log("owner balance: ", ownerBalance);
        await expect(ownerBalance).to.equal(initialSupply);
    });

    it("White list test", async function(){
        const [Token, Claim] = await loadFixture(deployContractsFixture);
        // only onwer
        //await expect(await Claim.connect(user1).addToWhitelist([user1, user2], [100, 200])).to.be.revertedWith("OwnableUnauthorizedAccount");
        // array lenth error
        //expect(await Claim.connect(owner).addToWhitelist([user1, user2], [100])).to.be.revertedWith("ArrayLengthMismatch");

        // token insuffcient
        //await Token.connect(owner).approve(Claim.target, 200);
        //await Claim.connect(owner).addToWhitelist([user1, user2], [100, 200]);

        // pass case
        await Token.connect(owner).approve(Claim.target, 1000000);
        await Claim.connect(owner).addToWhitelist([user1.address, user2.address], [100, 200]);

        let user1Balance = await Claim.whitelist(user1.address);
        expect(user1Balance).to.equal(100);
        console.log("user1 balance: ", user1Balance);
        let user2Balance = await Claim.whitelist(user2.address);
        expect(user2Balance).to.equal(200);
        console.log("user2 balance: ", user2Balance);


        // re add white list
        await Claim.connect(owner).addToWhitelist([user1.address, user3.address], [1000, 500]);
        user1Balance = await Claim.whitelist(user1.address);
        console.log("user1 balance added twice: ", user1Balance);
        expect(user1Balance).to.equal(1100);

        let user3Balance = await Claim.whitelist(user3.address);
        expect(user3Balance).to.equal(500);
        console.log("user3 balance: ", user3Balance);

        let ownerBalance = await Token.balanceOf(owner.address);
        console.log("owner balance: ", ownerBalance);
        await expect(ownerBalance).to.equal(initialSupply - 1100 - 200 -500);

        // update white 
        // only owner -- pass
        //await Claim.connect(user1).updateAmount(user2.address, 100);

        // amount equal
        await Claim.connect(owner).updateAmount(user3.address, 500);
        user3Balance = await Claim.whitelist(user3.address);
        expect(user3Balance).to.equal(500);
        console.log("user3 balance after update the same amount: ", user3Balance);

        // charge 500 to user3
        await Claim.connect(owner).updateAmount(user3.address, 1000);
        user3Balance = await Claim.whitelist(user3.address);
        expect(user3Balance).to.equal(1000);
        console.log("user3 balance after update: ", user3Balance);

        ownerBalance = await Token.balanceOf(owner.address);
        console.log("owner balance: ", ownerBalance);
        await expect(ownerBalance).to.equal(initialSupply - 1100 - 200 -500 - 500);

        // withdraw 100 from user2
        await Claim.connect(owner).updateAmount(user2.address, 100);
        user2Balance = await Claim.whitelist(user2.address);
        expect(user2Balance).to.equal(100);
        console.log("user2 balance after update: ", user2Balance);

        ownerBalance = await Token.balanceOf(owner.address);
        console.log("owner balance: ", ownerBalance);
        await expect(ownerBalance).to.equal(initialSupply - 1100 - 200 -500 - 500 + 100);

        // user1 1100, user2 100, user3 1000
        // pause
        // only owner -- pass
        //await Claim.connect(user1).pause();
        // in pause -- pass
        //await Claim.connect(owner).pause();
        //await Claim.connect(user1).claim();

        // only owner --pass
        await Claim.connect(owner).removeFromWhitelist(user3.address);

        user3Balance = await Claim.whitelist(user3.address);
        expect(user3Balance).to.equal(0);
        console.log("user3 balance after remove: ", user3Balance);

        ownerBalance = await Token.balanceOf(owner.address);
        console.log("owner balance: ", ownerBalance);
        await expect(ownerBalance).to.equal(initialSupply - 1100 - 200 -500 - 500 + 100 + 1000);

        // claim
        // user1 1100, user2 100, user3 0
        await Claim.connect(user1).claim();
        await Claim.connect(user2).claim();
        // claim no token -- pass
        //await Claim.connect(user3).claim();
        user1Balance = await Claim.whitelist(user1.address);
        expect(user1Balance).to.equal(0);
        console.log("user1 balance after claim: ", user1Balance);

        user2Balance = await Claim.whitelist(user2.address);
        expect(user2Balance).to.equal(0);
        console.log("user2 balance after claim: ", user2Balance);

        user3Balance = await Claim.whitelist(user3.address);
        expect(user3Balance).to.equal(0);
        console.log("user3 balance after claim: ", user3Balance);

        let user1Token = await Token.balanceOf(user1.address);
        console.log("user1 token balance: ", user1Token);
        expect(user1Token).to.equal(1100);

        let user2Token = await Token.balanceOf(user2.address);
        console.log("user2 token balance: ", user2Token);
        expect(user2Token).to.equal(100);

        let user3Token = await Token.balanceOf(user3.address);
        console.log("user3 token balance: ", user3Token);
        expect(user3Token).to.equal(0);
    });
});