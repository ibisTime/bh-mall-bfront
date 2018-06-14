<template>
    <div class="replying">
        <div class="tip">请补缴门槛费
          <button @click="reCharge">前去充值</button>
          </div>
        
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
  font-size: 0.3rem;
  .tip {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  button {
    display: inline-block;
    width: 2rem;
    height: 1rem;
    background-color: #7171c6;
    border-radius: 5px;
  }
}
</style>