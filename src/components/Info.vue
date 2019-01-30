<template>
  <div>
    <v-container v-if="!robonomicsStatus" fluid fill-height class="px-3">
      <v-layout
        justify-center
        align-center
      >
        <v-flex text-xs-center>
          <h1>Load robonomics</h1>
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container v-if="robonomicsStatus" grid-list-md class="px-3">
      <v-layout justify-center row wrap>
        <v-flex sm12 md10 lg6>
          <v-card>
            <v-card-title primary-title>
              <v-container grid-list-md>
                <v-layout row wrap>
                  <v-flex md12 class="text-xs-center">
                    <h3 class="headline mb-0 text-xs-center">Drone simulation</h3>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-title>
            <v-card-text>
              <demand-form ref="demandForm" />
              <v-container v-if="price.value > 0" grid-list-md>
                <v-layout row wrap>
                  <v-flex md12>
                    <div>
                      Cost: {{price.valueStr}} |
                      Balance: {{balance.valueStr}} |
                      Approved: {{approveTrade.valueStr}}
                    </div>
                  </v-flex>
                </v-layout>
              </v-container>

              <div class="text-xs-center">
                <v-btn
                  v-if="approveTrade.value < price.value"
                  :loading="loadingApprove"
                  :disabled="loadingApprove || balance.value < price.value"
                  color="warning"
                  @click.native="sendApproveTrade"
                >
                  Approve
                </v-btn>
                <v-btn
                  v-if="approveTrade.value >= price.value"
                  :loading="loadingOrder"
                  :disabled="loadingOrder || balance.value < price.value"
                  color="warning"
                  @click.native="order"
                >
                  Order
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <v-card v-if="liability">
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Received data</h3>
              </div>
            </v-card-title>
            <v-card-text>
              <Liability :liability="liability" />
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import _has from 'lodash/has'
import { Token } from 'robonomics-js'
import getRobonomics from '../utils/robonomics'
import { formatDecimals, watchTx } from '../utils/utils'
import Liability from './Liability'
import DemandForm from './DemandForm'
import * as config from '../config'
import getIpfs, { cat as ipfsCat } from '../utils/ipfs'
import rosBag from '../utils/rosBag'

let robonomics

export default {
  name: 'info',
  components: {
    Liability,
    DemandForm
  },
  data () {
    return {
      robonomicsStatus: false,
      token: null,
      price: {
        value: config.PRICE,
        valueStr: `${config.PRICE} ${config.TOKEN_SYMBOL}`
      },
      loadingApprove: false,
      loadingOrder: false,
      isOrder: false,
      balance: {
        value: 0,
        valueStr: ''
      },
      approveTrade: {
        value: 0,
        valueStr: ''
      },
      liability: null
    }
  },
  created () {
    return getIpfs()
      .then(() => getRobonomics())
      .then((r) => {
        robonomics = r
        return robonomics.ready()
      })
      .then(() => {
        console.log('xrt', robonomics.xrt.address)
        console.log('factory', robonomics.factory.address)
        console.log('lighthouse', robonomics.lighthouse.address)
        this.token = new Token(robonomics.web3, config.TOKEN)
        robonomics.getDemand(null, (msg) => {
          console.log('demand', msg)
        })
        robonomics.getResult((msg) => {
          console.log('result unverified', msg)
          if (web3.toChecksumAddress(msg.liability) === web3.toChecksumAddress(robonomics.account)) {
            this.liability = {
              address: '',
              resultMessage: []
            }
            this.setResult(msg.result, true)
          } else if (this.liability !== null && msg.liability === this.liability.address) {
            this.setResult(msg.result, false)
          }
        })
        this.fetchBalance()
          .then(() => {
            this.robonomicsStatus = true
          })
      })
  },
  methods: {
    fetchBalance () {
      return this.token.call('balanceOf', [robonomics.account])
        .then((balanceOf) => {
          this.balance.value = balanceOf
          this.balance.valueStr = `${formatDecimals(balanceOf, config.TOKEN_DECIMALS)} ${config.TOKEN_SYMBOL}`
          if (balanceOf > 0) {
            return this.token.call('allowance', [robonomics.account, robonomics.factory.address])
          }
          return 0
        })
        .then((allowance) => {
          this.approveTrade.value = allowance
          this.approveTrade.valueStr = `${formatDecimals(allowance, config.TOKEN_DECIMALS)} ${config.TOKEN_SYMBOL}`
        })
    },
    sendApproveTrade () {
      this.loadingApprove = true
      return this.token.send('approve', [robonomics.factory.address, this.price.value * 100], { from: robonomics.account })
        .then((r) => watchTx(r))
        .then(() => this.fetchBalance())
        .then(() => {
          this.loadingApprove = false
        })
        .catch(() => {
          this.loadingApprove = false
        })
    },
    setResult (result, check = true) {
      this.liability = {
        ...this.liability,
        result,
        check
      }
      if (this.liability.resultMessage.length === 0) {
        this.liability.resultMessage.push('')
        ipfsCat(result)
          .then((r) => {
            rosBag(new Blob([r]), (bag) => {
              try {
                const json = JSON.parse(bag.message.data)
                if (_has(json, 'weather')) {
                  this.liability.resultMessage.push({
                    type: 1,
                    json,
                    str: JSON.stringify(json, undefined, 2)
                  })
                } else {
                  this.liability.resultMessage.push({
                    type: 2,
                    str: JSON.stringify(json, undefined, 2)
                  })
                }
              } catch (e) {
                this.liability.resultMessage.push({
                  type: 3,
                  str: bag.message.data
                })
              }
            }, {})
          })
      }
    },
    newLiability (liability) {
      console.log('liability demand', liability.address)
      return liability.getInfo()
        .then((info) => {
          this.liability = {
            address: liability.address,
            worker: liability.worker,
            ...info,
            resultMessage: []
          }
          liability.watchResult((result) => {
            console.log('result', result)
            this.setResult(result, true)
          })
          return true
        })
        .catch((e) => {
          console.log(e)
          setTimeout(() => {
            this.newLiability(liability)
          }, 2000)
        })
    },
    order () {
      if (this.$refs.demandForm.$refs.form.validate()) {
        this.liability = null
        this.loadingOrder = true
        robonomics.web3.eth.getBlock('latest', (e, r) => {
          const demand = {
            objective: this.$refs.demandForm.objective,
            token: this.token.address,
            cost: config.PRICE,
            lighthouse: robonomics.lighthouse.address,
            validator: '0x0000000000000000000000000000000000000000',
            validatorFee: 0,
            deadline: r.number + 1000
          }
          robonomics.postDemand(config.MODEL, demand)
            .then((liability) => this.newLiability(liability))
            .then(() => {
              this.loadingOrder = false
            })
            .catch(() => {
              this.loadingOrder = false
            })
        })
      }
    }
  }
}
</script>
