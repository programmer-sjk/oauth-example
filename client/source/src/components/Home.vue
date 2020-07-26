<template>
    <div>
        <div>
            Login에 성공했습니다. 축하드려요!
        </div>
        <input class="userBtn" type="button" value="server 유저 정보" @click="getUserInfo">
        <div>
            {{id}}
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Home',
    props: [],
    data: function() {
        return {
            id: "",
            token: "",
            refreshToken: ""
        }
    },
    methods: {
        getUserInfo: function() {
            axios.get(this.$serverUrl + '/user')
                .then(r => {
                    this.id = r.data
                }).catch(e => {
                    if(e.response.status === 401 && this.refreshToken) {
                        this.getAccessToken()
                            .then(_ => {
                                this.id = ""
                                this.getUserInfo()
                            })
                            .catch(e => console.log(e))
                    } else {
                        this.id = ""
                    }
                })
        },
        getAccessToken: function() {
            return new Promise((resolve, reject) => {
                const id = this.id
                const data = {
                    refreshToken: this.refreshToken, 
                    id: id
                }

                axios.post(this.$serverUrl + '/token', data)
                    .then(r => {
                        const token = r.headers['authorization'].split(' ')[1];
                        this.setAccessToken(token);
                        resolve(true);
                    }).catch(e => {
                        reject(false);
                    })
            })
        },
        setAccessToken: function(token) {
            if(token) {
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
            }
        },
    },
    mounted() {
        this.refreshToken = this.$cookies.get('refreshToken')
        this.token = this.$cookies.get('token')
        if(this.token) {
            this.setAccessToken(this.token)
        }    
    },
    beforeCreate() {
        if(this.$route.query.token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$route.query.token
            this.$router.replace('/home')
        }
    }
}
</script>

<style scoped>
    .userBtn {
        margin-top: 20px;
    }
</style>
