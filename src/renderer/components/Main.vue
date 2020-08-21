<template>
  <div>
    dddddddddddddddd
  </div>
</template>

<script>
// import axios from 'axios';
// import qs from 'qs'
const { ipcRenderer } = require('electron')
// var _this = null;
export default {
  name: 'Main',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
  },
  mounted: function () {
    //_this = this;
    console.log('send test ping start')
    console.log(ipcRenderer.sendSync('test', 'ping'))
    console.log('send test ping end')
  },
  methods: {
  }
}
</script> 

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
$header-height: 60px;
$footer-height: 60px;
$main-height: calc( 100vh - #{$header-height} - #{$footer-height});
.header{
  height:$header-height;
  background:#106EFF;
  line-height: $header-height;
  font-size:28px;
  color:#ffffff;
}
.main{
  min-height: $main-height;
}
.foot{
  height: $footer-height;
  background:#106EFF;
  line-height: $header-height;
  font-size:28px;
  color:#ffffff;
}
</style>
