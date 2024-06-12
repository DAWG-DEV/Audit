const hre = require("hardhat");

async function toWei(amount) {
    return BigInt(await hre.ethers.parseEther(amount.toString()));
}


//owner pub address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
const owner = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d");
const ownerAddress = owner.address;
const gasInfo = { gasPrice: 90000000000, gasLimit: 5000000 };

async function main() {
    const initialSupply = 69420000000000;
    const MemeToken = await hre.ethers.getContractFactory("Token");
    const MemeTokenDe = await MemeToken.deploy(initialSupply, "StarBase", "ST", ownerAddress, gasInfo);
    console.log("MemeToken deployed at:", MemeTokenDe.target);
    let balance = await MemeTokenDe.balanceOf(ownerAddress);
    console.log("owner balance: ", balance.toString());

    const TokenClaim = await hre.ethers.getContractFactory("TokenClaim");
    const ClaimDe = await TokenClaim.deploy(MemeTokenDe.target, ownerAddress);
    console.log("TokenClaim deployed at:", ClaimDe.target);

    const user1 = new ethers.Wallet("0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a");
    //console.log("user 1 address", user1.address)
    const user2 = new ethers.Wallet("0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6");
    //console.log("user 1 address", user2.address)

  /*
    // 添加白名单
    await MemeTokenDe.addToWhitelist([owner], [toWei(1000)], gasInfo);
    console.log("Whitelist added for address:", owner);

    // 领取代币
    await MemeTokenDe.claim(gasInfo);
    console.log("Tokens claimed by address:", owner);

    // 重复领取代币（应该失败）
    try {
        await MemeTokenDe.claim(gasInfo);
    } catch (error) {
        console.log("Second claim failed as expected:", error.message);
    }

    // 移除白名单
    await MemeTokenDe.removeFromWhitelist("0x0A64Bc73793FAf399Adb51EBAd204Acb11F0ae64",gasInfo);
    console.log("Whitelist removed for address:", "0x0A64Bc73793FAf399Adb51EBAd204Acb11F0ae64");

    // 验证移除白名单后的操作
    // （尝试领取代币，暂停领取功能等）

    // 暂停领取功能
    await MemeTokenDe.pause(gasInfo);
    console.log("Claiming function paused");

    // 尝试领取代币（应该失败）
    try {
        await MemeTokenDe.claim(gasInfo);
    } catch (error) {
        console.log("Claiming while paused failed as expected:", error.message);
    }

    // 恢复领取功能
    await MemeTokenDe.unpause(gasInfo);
    console.log("Claiming function unpaused");

    // 添加白名单
    await MemeTokenDe.addToWhitelist([owner], [toWei(1000)], gasInfo);
    console.log("Whitelist added for address:", owner);

    // 尝试领取代币（应该成功）
    await MemeTokenDe.claim(gasInfo);
    console.log("Tokens claimed after unpausing");
*/
}

/*
Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (10000 ETH)
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

Account #3: 0x90F79bf6EB2c4f870365E785982E1f101E93b906 (10000 ETH)
Private Key: 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6

Account #4: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 (10000 ETH)
Private Key: 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a

Account #5: 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc (10000 ETH)
Private Key: 0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba

Account #6: 0x976EA74026E726554dB657fA54763abd0C3a0aa9 (10000 ETH)
Private Key: 0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e

Account #7: 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955 (10000 ETH)
Private Key: 0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356

Account #8: 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f (10000 ETH)
Private Key: 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97

Account #9: 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720 (10000 ETH)
Private Key: 0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6

Account #10: 0xBcd4042DE499D14e55001CcbB24a551F3b954096 (10000 ETH)
Private Key: 0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897

Account #11: 0x71bE63f3384f5fb98995898A86B02Fb2426c5788 (10000 ETH)
Private Key: 0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82
*/
main();
