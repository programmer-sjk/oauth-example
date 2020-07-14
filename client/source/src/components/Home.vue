<template>
    <div>
        <div>
            Login에 성공했습니다. 축하드려요!
        </div>
        <input class="userBtn" type="button" value="server 유저 정보" @click="getUserInfo">
        <div>
            {{username}}
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
            username: "",
        }
    },
    methods: {
        getUserInfo: function() {
            axios.get(this.$serverUrl + '/user')
                .then(r => {
                    this.username = r.data
                }).catch(e => this.username = "")
        }
    }
}
</script>

<style scoped>
    .userBtn {
        margin-top: 20px;
    }
</style>
