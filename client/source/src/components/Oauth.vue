<template>
    <div class="oauth_wrap">
        <div class="oauth_google pointer" @click="setOauth(1)"> <img src="../../public/images/google.jpg" width="60px"> </div>
        <div class="oauth_naver pointer" @click="setOauth(2)"> <img src="../../public/images/naver.jpg" width="60px"> </div>
        <div class="oauth_kakao pointer" @click="setOauth(3)"> <img src="../../public/images/kakao.png" width="60px"> </div>
    </div>  
</template>

<script>
export default {
  name: 'Oauth',
  data: function() {
      return {
          oauth_way: 0
      }
  },
  methods: {
      setOauth: function(type) {
          this.$emit('set-auth', type);
      }
  }
  
}
</script>

<style scoped>
    .oauth_wrap {
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
