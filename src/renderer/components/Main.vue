<template>
  <div>
    <div v-show="cur_page=='login'?true:false">
      <div class="title">{{$t("m.login.please_login")}}</div>
      <div>
        <div class="input_form">
          <div class="form_row1">
            <div class="input_label">{{$t("m.login.user_name")}}</div>
          
            <el-select class="input_box" v-model="account_value" :placeholder="$t('m.login.please_select')">
              <el-option
                v-for="item in account_list"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
           
          </div>
          
          <div class="form_row2">
            <div class="input_label">{{$t("m.login.password")}}</div>
            <el-input class="input_box" :placeholder="$t('m.login.please_input_password')" v-model="account_password" show-password></el-input>
          </div>
          <el-button class="btn_login" type="primary" style="margin-top:24px;" @click="Login">{{$t("m.login.login")}}</el-button>
          <div class="assist_line clearfix">
            <el-link class="left" type="primary" @click="cur_page='create'">{{$t("m.login.new_account")}}</el-link>
            <el-link class="right" type="primary">{{$t("m.login.import_account")}}</el-link>
          </div>
          
        </div>
        
      </div>
    </div>
    <div v-show="cur_page=='create'?true:false">
      <div class="title">{{$t("m.login.create_title")}}</div> 
      <div class="input_form">
        <div class="form_row1">
          <div class="input_label">{{$t("m.login.user_name")}}</div>
          <el-input class="input_box" :placeholder="$t('m.login.please_input_account_name')" v-model="create_account_username"></el-input>
        </div>
        <div class="form_row2">
          <div class="input_label">{{$t("m.login.password")}}</div>
          <el-input class="input_box" :placeholder="$t('m.login.please_input_password')" v-model="create_account_password" show-password></el-input>
        </div>
        <div class="form_row3">
          <div class="input_label">{{$t("m.login.repeat_password")}}</div>
          <el-input class="input_box" :placeholder="$t('m.login.repeat_passwrod_placeholder')" v-model="create_account_password_repeat" show-password></el-input>
        </div>
        <div class="clearfix">
          <el-button class="btn_create left" type="primary" style="margin-top:24px;" @click="CreateAccount">{{$t("m.login.create_account")}}</el-button>
          <el-button class="btn_back right" plain style="margin-top:24px;" @click="cur_page = 'login'">{{$t("m.login.back")}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';
// import qs from 'qs'
const { ipcRenderer } = require('electron')
var _this = null
export default {
  name: 'Main',
  data () {
    return {
      cur_page: 'login',
      account_value: '',
      account_password: '',

      create_account_username: '',
      create_account_password: '',
      create_account_password_repeat: '',
      account_list: []
      // account_list: [/* {value:'', label:''} */]
    }
  },
  components: {
  },
  mounted: function () {
    _this = this
    _this.FlushAccountList()
    console.log('send test ping start')
    console.log(ipcRenderer.sendSync('test', 'ping'))
    console.log('send test ping end')
  },
  methods: {
    FlushAccountList:function(){
      _this.account_list = []
      var account_list = ipcRenderer.sendSync('get_account_list')
      account_list.forEach(function(filename){
        _this.account_value = filename;
        _this.account_list.push({value: filename, label: filename});
      })
    },
    CreateAccount: function () {
      _this.create_account_username.replace(/(^\s*)|(\s*$)/g, '')
      if (_this.create_account_username === '') {
        _this.$alert(_this.$t("m.login.user_name_null"), _this.$t("m.alert"), {
          confirmButtonText: _this.$t("m.ok"),
        })
      }else if(_this.create_account_password === "" ||
      _this.create_account_password_repeat === "" ||
      _this.create_account_password !== _this.create_account_password_repeat){
        _this.$alert(_this.$t("m.login.repeat_password_error"), _this.$t("m.alert"), {
          confirmButtonText: _this.$t("m.ok"),
        })
      }else{
        if(ipcRenderer.sendSync('create_account', {
          username:_this.create_account_username,
          password:_this.create_account_password
        })){
            _this.$alert(_this.$t("m.login.account_create_ok"), _this.$t("m.alert"), {
              confirmButtonText: _this.$t("m.ok"),
              callback: action => {
                _this.cur_page = "login"
                _this.FlushAccountList()
              }
            })
        }
        else{
          _this.$alert(_this.$t("m.login.account_create_faild"), _this.$t("m.alert"), {
              confirmButtonText: _this.$t("m.ok"),
          })
        }
      }
    },
    Login:function(){
      /*alert(_this.account_value)
      alert(_this.account_password)*/
      if(_this.account_value === ""){
        _this.$alert(_this.$t("m.login.account_null"), _this.$t("m.alert"), {
            confirmButtonText: _this.$t("m.ok"),
            callback: action => {
            }
          })
          return;
      }
      else if(_this.account_password === ""){
        _this.$alert(_this.$t("m.login.password_null"), _this.$t("m.alert"), {
            confirmButtonText: _this.$t("m.ok"),
            callback: action => {
            }
          })
      }else{
        var ddd = ipcRenderer.sendSync('login',{})
        console.log("connect result:"+ddd)
      }

    }
  }
}
</script> 

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

@import "../../style/self.scss";

.title{
  margin-top:48px;
  font-size:24px;
  text-align: center;
}

.form_row1{
  margin-top:36px;
}

.form_row2{
  margin-top:24px;
}

.form_row3{
  @extend .form_row2;
}

.input_form{
  width:360px;
  text-align: left;
  margin: 0 auto;
}

.input_box{
  width:100%;
  margin-top:12px;
}

.btn_login{
  width:100%;
  margin-top:12px;
}
.btn_create{
  box-sizing: border-box;
  width:70%;
  margin-top:12px;
}
.btn_back{
  box-sizing: border-box;
  width:20%
}
.assist_line{
  margin-top:12px;
  height:24px;
  line-height:24px;
}
</style>
