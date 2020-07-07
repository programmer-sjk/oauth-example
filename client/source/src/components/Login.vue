<template>
    <div class="login_wrap">
        <div class="login_container">
            <h1 class="main_txt"> oauth 로그인</h1>
            <div class="login_info">
                <input class="id" type="text" placeholder="아이디" v-model="id">
                <input class="pwd" type="password" placeholder="패스워드" v-model="pwd"> 
            </div>
            <div class="login_btn" @click="login"> {{loginWay}} 로그인 </div>
            <div class="clear"></div>
            <oauth @set-auth="getOauthWay"/>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import oauth from './Oauth.vue'
export default {
    name: 'Login',
    components: {
        oauth
    },
    data: function() {
        return {
            id: "",
            pwd: "",
            loginWay: ""
        }
    },
    methods: {
        login: function() {
            console.log(this.id, this.pwd)
            axios.get('http://localhost:3000')
            .then(r => console.log(r))
        },
        getOauthWay: function(type) {
            switch(type) {
                case 1:
                    this.loginWay = "구글";
                    break;
                case 2:
                    this.loginWay = "네이버";
                    break;
                case 3:
                    this.loginWay = "카카오";
                    break; 
            
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login_wrap {
    width: 800px;
    height: 100%;
    margin: 0 auto;
    position: relative;
}

.login_container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 50%;
}

.main_txt {
    text-align: center;
    padding-bottom: 20px;
}

.login_info {
    float: left;
    margin-left: 100px;
    padding-right: 10px;
}

.id {
    display: block;
    height: 25px;
    width: 300px;
}

.pwd {
    height: 25px;
    width: 300px;
}

.login_btn {
    text-align: center;
    color: white;
    float: left;
    height: 62px;
    line-height: 62px;
    width: 120px;
    background-color: #3f463f;
}

.clear {
    clear: both;
}

</style>
