<template>
	<div class="systemMessage">
		<div class="container">
			<div class="item">
				<img src="../../assets/message/systemMessage@2x(1).png" alt="">
				<div class="item-info">
					<span class="title">正汇商家正式上线</span>
					<i class="time">2018-03-24</i>
					<div class="content">正汇商家正式上线了，如有问题请咨询人工智能啦啦啦啦啦，谢谢</div>
				</div>
			</div>
			<div class="item">
				<img src="../../assets/message/systemMessage@2x(1).png" alt="">
				<div class="item-info">
					<span class="title">正汇商家正式上线</span>
					<i class="time">2018-03-24</i>
					<div class="content">正汇商家正式上线了，如有问题请咨询人工智能啦啦啦啦啦，谢谢</div>
				</div>
			</div>
		</div>
		<div class="load">
			<img src="../../assets/message/jiazai.png" alt="">
			<span class="loadtext">已经全部加载完毕</span>
		</div>
	</div>
</template>
<script>
export default {
  name:'systemMessage',
  data(){
      return{}
  },
  methods:{

  }
}
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.systemMessage {
  .fl {
    float: left;
  }
  font-size: $font-size-small;
  .container {
    padding-left: 0.3rem;
    .item {
      border-bottom: 1px solid #eee;
      padding: 0.3rem 0.3rem 0.5rem 0;
      img {
        float: left;
        width: 0.64rem;
      }
      .item-info {
        // height: 2rem;
        margin-left: 0.84rem;
        // background-color: #000;
        .title {
          display: block;
          font-size: $font-size-medium-x;
          color: #333;
        }
        .time {
          display: block;
          margin-top: 0.2rem;
          color: #999;
        }
        .content {
          margin-top: 0.3rem;
          line-height: 0.4rem;
          padding: 0.28rem 0.26rem;
          background-color: #f5f5f5;
        }
      }
    }
	}
	.load{
		margin-top: 0.3rem;
		text-align: center;
		img{
			width: 0.25rem;
		}
		.loadtext{
			margin-left: 0.1rem;
			font-size: $font-size-small-s;
			color: #d3d3d3;
		}
	}
}
</style>
