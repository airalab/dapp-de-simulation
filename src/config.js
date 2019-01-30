export const VERSION = 4
export const ROBONOMICS = {
  1: {
    ens: '',
    ensSuffix: '',
    lighthouse: 'mobilerobotics.lighthouse.4.robonomics.eth'
  },
  // 42: {
  //   ens: '0x9C9e837dfb1e8188E6cc63E105545f9424Bc4D00',
  //   ensSuffix: '',
  //   lighthouse: 'test.lighthouse.4.robonomics.eth'
  // }
}
export const IPFS_PUBSUB = 'https://wss.pool.aira.life' // https://github.com/vol4tim/ipfs-api-pubsub-ws

export const MODEL = 'QmY5NqZdbHqupP5xrTCkPGh6n5NthET7ePwmL2qewTrxcF' // drone-employee simulation
export const OBJECTIVE = 'QmVAFgUxBitKqtV2sjaYcHkKfcAPVy3GswhaE5n5bcgLkf'
// export const TOKEN = '0x05d6FC4F85f25B7c6fC89d1E83216cBD98739fBD'
export const TOKEN = '0xc34B089D3Dfe7bdf39a7Cd3D64116b2395dba845'
export const TOKEN_SYMBOL = 'UT'
export const TOKEN_DECIMALS = 0
export const PRICE = 0

export const IPFS_CONFIG = {
  repo: 'ipfs/robonomics',
  // EXPERIMENTAL: {
  //   pubsub: true
  // },
  config: {
    Addresses: {
      Swarm: [
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
      ]
    },
    Bootstrap: [
      '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
      '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
      // '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
      // '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
      '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
      '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
      '/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
      '/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
      '/dns4/wss.ipfs.pool.aira.life/tcp/443/wss/ipfs/QmdfQmbmXt6sqjZyowxPUsmvBsgSGQjm4VXrV7WGy62dv8'
    ]
  }
}
