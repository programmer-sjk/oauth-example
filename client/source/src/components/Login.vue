<template>
    <div class="login_wrap">
        <div class="login_container">
            <h1 class="main_txt"> oauth 로그인</h1>
            <div class="login_info">
                <input class="id" type="text" placeholder="아이디" v-model="id">
                <input class="pwd" type="password" placeholder="패스워드" v-model="pwd"> 
            </div>
            <div class="login_btn" @click="login"> 로그인 </div>
            <div class="clear"></div>

            <div class="oauth_container">
                <oauth class="oauth pointer" :way="oauthWays[0]" :bgColor="'#F0F8FF'"/>
                <oauth class="oauth pointer" :way="oauthWays[1]" :bgColor="'#19ce60'"/>
                <oauth class="oauth pointer" :way="oauthWays[2]" :bgColor="'rgba(255,238,51,0.99)'"/>
            </div>
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
            oauthWays: ["google", "naver", "kakao"],
            loginUrl: this.$serverUrl + "/login"
        }
    },
    methods: {
        login: function() {
            const body = {id: this.id, password: this.pwd}
            axios.post(this.loginUrl, body)
                .then(r => {
                    this.setAccessToken(r);
                    this.$cookies.set('refreshToken', r.data.refreshToken)
                    this.$router.push('home')
                }).catch(e => {
                    this.id = this.pwd = '';
                    alert('로그인에 실패했습니다.')
                })
        },
        setAccessToken: function(response) {
            const token = response.headers['authorization'].split(' ')[1];
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
        },
    }
}
</script>

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
    cursor: pointer;
}

.clear {
    clear: both;
}

.oauth_container {
    text-align: center;
    margin-top: 10px;
}

.oauth {
    margin: 10px 0px 10px 100px;
    width: 440px;
    line-height: 30px;
}

.pointer {
    cursor: pointer;
}

</style>
