<template>
  <div>
    <v-form ref="form" v-model="valid">
      <v-text-field
        v-model="objective"
        :rules="requireRule"
        label="objective"
        required
      ></v-text-field>
    </v-form>
  </div>
</template>

<script>
import * as config from '../config'

export default {
  data () {
    return {
      valid: false,
      objective: config.OBJECTIVE,
      requireRule: [
        v => !!v || 'Field required'
      ]
    }
  }
}
</script>
