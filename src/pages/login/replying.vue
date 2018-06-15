<template>
    <div class="replying">
        <div class="tip">正在受理中.....</div>
    </div>
</template>
<script>
export default {
  mounted(){
      
  }
}
</script>
<style lang="scss" scoped>
.replying{
    font-size: 0.3rem;
    .tip{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
}
</style>
