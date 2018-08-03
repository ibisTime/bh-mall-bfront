<template>
    <div>
        <div class="prompt" v-show="isPrompt">
            <div class="msg-box">
                <p class="msg-tit">{{isTeam ? '请输入团队名' : '请完善您的身份信息'}}</p>
                <div class="msg-input">
                    <input type="text" v-model="teamName" v-show="isTeam">
                    <div v-show="!isTeam">
                        <p class="sf-p">身份证号：</p>
                        <p class="sf"><input type="text"></p>
                    </div>
                </div>
                <div class="btn-box">
                    <button @click="hide">取消</button>
                    <button @click="getPromptMsg">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                isPrompt: false,
                teamName: '',
                promptMsg: {},
                isTeam: false
            }
        },
        methods: {
            show(){
                this.isPrompt = true;
            },
            hide(){
                this.isPrompt = false;
            },
            getPromptMsg(){
                if(this.teamName === ''){
                    return;
                }
                this.$emit('teamName', this.teamName);
                this.teamName = '';
            }
        }
    }
</script>

<style scoped>
.prompt{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, .5);
    z-index: 999;
}
.msg-box{
    width: 90%;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    background-color: #f5f5f5;
    border-radius: 4px;
    text-align: center;
    font-size: 0.34rem;
    padding: 0.4rem 0;
}
.msg-tit{
    padding-bottom: .3rem;
}
.msg-input{
    margin-top: .1rem;
    margin-bottom: 0.4rem;
    padding: 0 0.4rem;
}
.msg-input>input{
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 0.1rem 0.2rem;
}
.msg-input>div{
    display: flex;
}
.sf-p{
    font-size: 0.34rem;
    vertical-align: middle;
    padding-top: .1rem;
    box-sizing: border-box;
}
.sf>input{
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 0.1rem 0.2rem;
}
.btn-box>button{
    padding: 0.25rem 0;
    border-radius: 3px;
    outline: none;
    width: 40%;
    font-size: 0.34rem;
    letter-spacing: 0.06rem;
    background-color: #f6f6f6;
    margin-right: 0.3rem;
}
.btn-box>button:nth-of-type(2){
    color: #26a2ff;
}
</style>

