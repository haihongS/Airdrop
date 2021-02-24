import { randomHex, soliditySha3 } from 'web3-utils'
import { MerkleTree } from './merkleTree'
import { buf2hex, hex2buf } from './helpers'
import endent from 'endent'
import Web3 from 'web3'

export function generate(accounts: string[]): string {
  const web3 = new Web3()
  const rawLeaves = accounts.map((address) => ({ address, amount: Math.floor(Math.random() * 100000) }))
  const leaves = rawLeaves.map((v, i) => {
    return {
      buf: Buffer.concat([
        hex2buf(web3.eth.abi.encodeParameter('uint256', i)),
        hex2buf(v.address),
        hex2buf(web3.eth.abi.encodeParameter('uint256', v.amount)),
      ]),
      ...v,
    }
  })

  const tree = new MerkleTree(
    leaves.map((l) => buf2hex(l.buf)),
    (soliditySha3 as unknown) as (...str: string[]) => string,
  )

  const offset = leaves.length - 146
  const leavesWithProof = leaves.slice(offset, offset + 10).map((l) => {
    return {
      address: l.address,
      proof: tree.generateProof(buf2hex(l.buf)),
      amount: l.amount,
    }
  })

  return (
    endent`
    const merkleRoot = "${tree.root}"
    const leaves = ${JSON.stringify(leavesWithProof, null, 2)}
  
    module.exports = {
      merkleRoot,
      leaves
    }
  ` +
    `
  `
  )
}
