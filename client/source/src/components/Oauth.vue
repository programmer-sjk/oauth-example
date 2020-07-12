<template>
    <div @click="setOauth()" :style="{'background-color': bgColor}" class="oauth_wrap"> 
        {{way}} 
    </div>
</template>

<script>
export default {
    name: 'Oauth',
    props: ['type', 'way', 'bgColor'],
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
}
</script>

<style scoped>
    .oauth_wrap {
        border-radius: 2em;
    }
</style>
