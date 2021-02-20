const chai = require('chai')
const expect = chai.expect
const AirDrop = artifacts.require("Airdrop")
const { leaves } = require("./constants")

let airDrop

contract("AirDrop", () => {
  beforeEach(async () => {
    airDrop = await AirDrop.deployed()
  })

  describe('check()', async () => {
    it('should verify root successful with proof generated by typescript', async () => {
      for (let i = 0; i < leaves.length; i++) {
        const leaf = leaves[i]
        const available = await airDrop.check.call(i, leaf.address, leaf.amount, leaf.proof)
        expect(available).to.be.true
      }
    })
  })
})  
