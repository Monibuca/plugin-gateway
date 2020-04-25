<template>
    <mu-tooltip :content="new Date(value).toLocaleString()">
        <Time :time="new Date(value)"></Time>
    </mu-tooltip>
</template>

<script>
    export default {
        name: "StartTime",
        props:{
            value:String
        }
    }
</script>

<style scoped>

</style>