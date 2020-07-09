<template>
    <div class="login_wrap">
        <div class="login_container">
            <h1 class="main_txt"> oauth 로그인</h1>
            <div class="login_info">
                <input class="id" type="text" placeholder="아이디" v-model="id">
                <input class="pwd" type="password" placeholder="패스워드" v-model="pwd"> 
            </div>
            <div class="login_btn" @click="login"> {{loginWay}} 로그인 </div>
            <div class="login_btn" @click="access"> 테스트 </div>
            <div class="clear"></div>

            <div class="oauth_container">
                <oauth class="oauth_google pointer" @set-auth="getOauthWay" :type="1" :img="imageNames[0]"/>
                <oauth class="oauth_naver pointer" @set-auth="getOauthWay" :type="2" :img="imageNames[1]"/>
                <oauth class="oauth_kakao pointer" @set-auth="getOauthWay" :type="3" :img="imageNames[2]"/>
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
            loginWay: "",
            imageNames: ["google", "naver", "kakao"],
            refreshToken: ""
        }
    },
    methods: {
        login: function() {
            const body = {id: this.id, password: this.pwd}

            axios.post('http://localhost:3000/login', body)
                .then(r => {
                    this.setAccessToken(r);
                    this.refreshToken = r.data.refreshToken;
                }).catch(e => {
                    this.id = this.password = '';
                })
        },
        access: function() {
            axios.get('http://localhost:3000')
                .then(r => {
                    console.log(r);
                }).catch(e => {
                    if(e.response.status === 401 && this.refreshToken) {
                        const ret = this.getAccessToken()
                        this.access();
                    }
                })
        },
        getAccessToken: function() {
            const data = {
                refreshToken: this.refreshToken, 
                id: this.id
            }

            axios.post('http://localhost:3000/token', data)
                .then(r => {
                    this.setAccessToken(r);
                    return true;
                }).catch(e => {
                    return false;
                })
        },
        setAccessToken: function(response) {
            const token = response.headers['authorization'].split(' ')[1];
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
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
    position: relative;
}

.oauth_google {
    position: absolute;
    top: 50px;
    left: 40%;
}

.oauth_naver {
    position: absolute;
    top: 150px;
    left: 40%;
}

.oauth_kakao {
    position: absolute;
    top: 250px;
    left: 40%;
}

.pointer {
    cursor: pointer;
}

</style>
