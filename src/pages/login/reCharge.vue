<template>
    <div class="replying">
        <div class="tip">充值审核中，请您耐心等待</div>
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
