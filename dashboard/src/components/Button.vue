<template>
  <div :class="isMouseDown?'a mousedown':'a'" @mousedown="isMouseDown=true" @mouseup="isMouseDown=false" @mouseleave="isMouseDown=false">
      <div class="b">
          <slot name="default"/>
      </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            isMouseDown:false
        }
    }
}
</script>

<style lang="less" scoped>
.a{
    margin: auto;
    width: 80px;
    height:30px;
    background: cyan;
    text-align: center;
    line-height: 30px;
    box-shadow: 0 0 5px 1px black inset,0 0 3px 0px cyan,0 0 10px 0 black inset,0 -10px 30px 0 black inset;
    color: rgba(255, 255, 255, 0.521);
    text-shadow: 0 0 3px cyan;
   position: relative;
}

.b{
    top: -2px;
    left: -2px;
    position: absolute;
    width: 80px;
    height:30px;
    box-shadow: 0 0 10px 0px white inset,0 0 3px 0px cyan;
}
.mousedown .b{
    top:0;
    left:0;
}
.b:hover{
    color: white;
    box-shadow:  0 0 5px 1px white inset,0 -10px 10px 1px cyan inset,2px 2px 3px 0 cyan;
}
</style>>