<template>
    <div :style="{'background-color': bgColor}" class="oauth_wrap"> 
        <a :href="googleLoginUrl"> {{way}} </a> 
    </div>
</template>

<script>
export default {
    name: 'Oauth',
    props: ['way', 'bgColor'],
    data: function() {
        return {
            oauth_way: 0,
        }
    },
    computed: {
        googleLoginUrl: function() {
            return `${this.$serverUrl}/login/${this.way}`
        }
    }
}
</script>

<style scoped>
    .oauth_wrap {
        border-radius: 2em;
    }

    a {
        text-decoration: none;
    }
 
</style>
