<template>
    <div class="oauth_wrap">
        <div @click="setOauth()"> <img :src="imagePath" width="60px"> </div>
    </div>  
</template>

<script>
export default {
    name: 'Oauth',
    props: ['type', 'img'],
    data: function() {
        return {
            oauth_way: 0,
        }
    },
    methods: {
        setOauth: function() {
            this.$emit('set-auth', this.type);
        }
    },
    computed: {
        imagePath: function() {
            return require("../../public/images/" + this.img + ".jpg")
        }
    }
}
</script>

<style scoped>
    
</style>
