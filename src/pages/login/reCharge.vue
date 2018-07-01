<template>
    <div class="replying">
        <div class="tip">充值申请请等待上级审核</div>
    </div>
</template>
<script>
export default {
  methods: {
    reCharge() {
      this.$router.push("/threshold");
    }
  }
};
</script>
<style lang="scss" scoped>
.replying {
  font-size: 0.32rem;
  .tip {
    text-align: center;
    margin-top: 2rem;
  }
}
</style>
