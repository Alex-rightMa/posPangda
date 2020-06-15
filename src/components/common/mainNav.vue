<template>
    <div class="mainNav">
        <ul>
            <li>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-xianshangzhifu"></use>
                </svg>
                <span>收银</span>
            </li>
            <li>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-icon_burger_coloured"></use>
                </svg>
                <span>店铺</span>
            </li>
            <li>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-fugoushuai"></use>
                </svg>
                <span>商品</span>
            </li>
            <li>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-zhanghaoxinxi"></use>
                </svg>
                <span>会员</span>
            </li>
            <li>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-shuliangtongji"></use>
                </svg>
                <span>统计</span>
            </li>
            <li>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-mendianshezhi"></use>
                </svg>
                <span>设置</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'MainNav',
    data () {
        return {
            msg: 'Welcome to Your Vue.js App'
        }
    }
}
</script>
<style lang="less">
    .mainNav{
        font-size: 10px;
        width: 5%;
        min-width: 60px;
        height: 100%;
        background-color: #0fb67f;
        ul{
            padding: 0;
            margin: 0;
            li{
                list-style-type: none;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 10px;
                border-bottom: 1px solid yellow;
                span{
                    margin-top: 4px;
                }
            }
        }
    }
    .icon{
        width: 2rem;
        height: 2rem;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>