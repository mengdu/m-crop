<template>
<div class="cut-box"  ref="cut"
  >
  <!-- 底图 -->
  <img src="" alt="" class="cut-img" ref="cut-img">
  <!-- 遮罩 -->
  <div class="cut-shade" v-show="imgUrl"></div>
  <div v-show="!imgUrl" class="cut-select">
    <label>
      <input type="file" @change="handleSelect" style="display: none"/>
      <div class="cut-select-panel">{{selectionTitle}}</div>
    </label>
  </div>
  <!-- 控制层 -->
  <div class="cut-control-bg"
    v-show="loaded"
    @mousedown.stop.prevent="selection"
    @touchstart.stop.prevent="selection"
    >
    <!-- 裁剪区 -->
    <div class="cut-view"
      v-show="showSelection && loaded"
      :style="{
        width: viewWidth + 'px',
        height: viewHeight + 'px',
        left: viewLeft + 'px',
        top: viewTop + 'px'
      }"
      >
      <img src=""  class="cut-view-img" ref="view-img"
        :style="{
          left: -viewLeft-1 + 'px',
          top: -viewTop-1 + 'px',
          width: cutPos.width + 'px',
          height: cutPos.height + 'px'
        }"
        >
    </div>
    <!-- 控制按钮 -->
    <div class="cut-control"
      v-show="showSelection"
      @mousedown.stop.prevent="viewClick"
      @touchstart.stop.prevent="viewClick"
      :style="{
        width: viewWidth + 'px',
        height: viewHeight + 'px',
        left: viewLeft + 'px',
        top: viewTop + 'px'
      }"
      ref="view"
      >
      <template>
      <div @mousedown.stop.prevent="ctrlClick" @touchstart.stop.prevent="ctrlClick">
        <template v-if="showCtrl">
        <div class="cut-c-point cut-p-left-top" @mousedown="direction = 'left-top'" @touchstart="direction = 'left-top'"></div>
        <div class="cut-c-point cut-p-center-top" @mousedown="direction = 'top'" @touchstart="direction = 'top'"></div>
        <div class="cut-c-point cut-p-right-top" @mousedown="direction = 'right-top'" @touchstart="direction = 'right-top'"></div>
        <div class="cut-c-point cut-p-right-middle" @mousedown="direction = 'right'" @touchstart="direction = 'right'"></div>
        <div class="cut-c-point cut-p-left-middle" @mousedown="direction = 'left'" @touchstart="direction = 'left'"></div>
        <div class="cut-c-point cut-p-right-bottom" @mousedown="direction = 'right-bottom'" @touchstart="direction = 'right-bottom'"></div>
        <div class="cut-c-point cut-p-center-bottom" @mousedown="direction = 'bottom'" @touchstart="direction = 'bottom'"></div>
        <div class="cut-c-point cut-p-left-bottom" @mousedown="direction = 'left-bottom'" @touchstart="direction = 'left-bottom'"></div>
        </template>
      </div>
      </template>
    </div>
  </div>
</div>
</template>
<script type="text/javascript">
import imgCutter from './img-cutter'

export default {
  name: 'MCrop',
  props: {
    src: {
      type: String
    },
    ctrlWidth: [String, Number],
    ctrlHeight: [String, Number],
    ctrlLeft: [String, Number],
    ctrlTop: [String, Number],
    showView: {
      type: Boolean,
      default: true
    },
    showCtrl: {
      type: Boolean,
      default: true
    },
    auto: {
      type: Boolean,
      default: true
    },
    selectionTitle: {
      type: String,
      default: '点击选择图片'
    },
    lockViewSize: Boolean
  },
  data () {
    return {
      imgUrl: '',
      cut: null,
      view: null,
      vw: 0,
      vh: 0,
      vl: 0,
      vt: 0,
      cutPos: {},
      viewPos: {},
      startPoint: {},
      moveType: '',
      direction: '',
      loaded: false,
      showSelection: false
    }
  },
  computed: {
    viewWidth () {
      if (this.view) {
        this.setViewPos()
      }
      var vw = this.vw
      return vw > this.cutPos.width ? this.cutPos.width : vw
    },
    viewHeight () {
      if (this.view) {
        this.setViewPos()
      }
      var vh = !this.auto ? this.vw : this.vh
      return vh > this.cutPos.height ? this.cutPos.height : vh
    },
    viewLeft () {
      if (!this.view) return 0
      // console.log('left change')
      var view = this.viewPos
      return (this.vl + view.width) >= this.cutPos.width ? this.cutPos.width - view.width : (this.vl < 0 ? 0 : this.vl)
    },
    viewTop () {
      if (!this.view) return 0
      var view = this.viewPos
      return (this.vt + view.height) >= this.cutPos.height ? this.cutPos.height - view.height : (this.vt < 0 ? 0 : this.vt)
    }
  },
  watch: {
    ctrlWidth (val) {
      this.vw = Math.abs(~~val)
    },
    ctrlHeight (val) {
      this.vh = Math.abs(~~val)
    },
    ctrlLeft (val) {
      this.vl = Math.abs(~~val)
    },
    ctrlTop (val) {
      this.vt = Math.abs(~~val)
    },
    src (val) {
      this.init()
    },
    showView (val) {
      this.showSelection = !!val
    }
  },
  methods: {
    selection (e) {
      e = e.touches ? e.touches[0] : e
      if (this.lockViewSize) return false
      const target = e
      const that = this
      const start = {
        clientX: e.clientX,
        clientY: e.clientY,
        offsetX: e.offsetX,
        offsetY: e.offsetY
      }
      // console.log('selection', e.offsetX, e.offsetY)
      function move (e) {
        e = e.touches ? e.touches[0] : e
        that.showSelection = true
        const offsetX = e.clientX - start.clientX
        const offsetY = e.clientY - start.clientY
        const width = Math.abs(offsetX)
        const height = Math.abs(offsetY)
        const left = offsetX > 0 ? start.offsetX : (start.offsetX - width)
        const top = offsetY > 0 ? start.offsetY : (start.offsetY - height)
        that.vl = left
        that.vt = top
        that.vw = width
        that.vh = height
      }
      function mouseup () {
        target.target.removeEventListener('mousemove', move)
        target.target.removeEventListener('mouseup', mouseup)
        target.target.removeEventListener('touchmove', move)
        target.target.removeEventListener('touchend', mouseup)
      }
      target.target.addEventListener('mousemove', move, false)
      target.target.addEventListener('mouseup', mouseup, false)
      target.target.addEventListener('touchmove', move, false)
      target.target.addEventListener('touchend', mouseup, false)
    },
    handleMove (e) {
      // console.log('move', e)
      e = e.touches ? e.touches[0] : e
      var offsetX = e.clientX - this.startPoint.clientX
      var offsetY = e.clientY - this.startPoint.clientY
      // 移动视区
      if (this.moveType === 'move') {
        this.vl = offsetX + this.startPoint.left
        this.vt = offsetY + this.startPoint.top
        this.setViewPos()
      } else if (this.moveType === 'size') {
        if (this.lockViewSize) return false
        // 改变尺寸
        // console.log('size change')
        switch (this.direction) {
          case 'left-top':
            this.vl = this.startPoint.left + offsetX
            this.vt = this.startPoint.top + offsetY
            this.vw = this.startPoint.width - offsetX
            this.vh = this.startPoint.height - offsetY
            break
          case 'top':
            this.vt = this.startPoint.top + offsetY
            this.vh = this.startPoint.height - offsetY
            break
          case 'right-top':
            this.vt = this.startPoint.top + offsetY
            this.vw = this.startPoint.width + offsetX
            this.vh = this.startPoint.height - offsetY
            break
          case 'right':
            this.vw = this.startPoint.width + offsetX
            break
          case 'left':
            this.vl = this.startPoint.left + offsetX
            this.vw = this.startPoint.width - offsetX
            break
          case 'right-bottom':
            this.vw = this.startPoint.width + offsetX
            this.vh = this.startPoint.height + offsetY
            break
          case 'bottom':
            this.vh = this.startPoint.height + offsetY
            break
          case 'left-bottom':
            this.vl = this.startPoint.left + offsetX
            this.vw = this.startPoint.width - offsetX
            this.vh = this.startPoint.height + offsetY
            break
        }
      }
    },
    contrlClick (e) {
      // 记录鼠标按下点信息
      e = e.touches ? e.touches[0] : e
      this.startPoint = {
        clientX: e.clientX,
        clientY: e.clientY,
        left: parseInt(this.view.style.left),
        top: parseInt(this.view.style.top),
        width: parseInt(this.view.style.width),
        height: parseInt(this.view.style.height)
      }
      var that = this
      function mouseup () {
        // console.log('mouseup')
        // 移动停止事件
        that.$emit('stop', {
          ...that.getCutInfo(),
          type: that.moveType
        })
        document.removeEventListener('mousemove', that.handleMove)
        document.removeEventListener('mouseup', mouseup)
        document.removeEventListener('touchmove', that.handleMove)
        document.removeEventListener('touchend', mouseup)
      }
      document.addEventListener('mousemove', this.handleMove, false)
      document.addEventListener('mouseup', mouseup, false)
      document.addEventListener('touchmove', this.handleMove, false)
      document.addEventListener('touchend', mouseup, false)
    },
    viewClick (e) {
      // console.log('view click')
      e = e.touches ? e.touches[0] : e
      this.moveType = 'move'
      this.contrlClick(e)
    },
    ctrlClick (e) {
      // console.log('ctrl click', this.direction)
      this.moveType = 'size'
      e = e.touches ? e.touches[0] : e
      this.contrlClick(e)
    },
    getCutInfo () {
      return {
        img: this.cutImg,
        src: this.imgUrl,
        clipLeft: parseInt(this.view.style.left),
        clipTop: parseInt(this.view.style.top),
        clipWidth: parseInt(this.view.style.width),
        clipHeight: parseInt(this.view.style.height),
        width: this.cutImg.width,
        height: this.cutImg.height
      }
    },
    getClip () {
      return new Promise((resolve, reject) => {
        var clipInfo = this.getCutInfo()
        var {width, height, clipTop, clipLeft, clipWidth, clipHeight} = clipInfo
        imgCutter.src(clipInfo.src).then(cut => {
          var img = cut.size(width, height).clip(clipLeft, clipTop, clipWidth, clipHeight)
          resolve(img)
        }).catch(err => {
          reject(err)
        })
      })
    },
    setViewPos () {
      var {width, height} = this.view.getBoundingClientRect()
      var {left, top} = this.view.style
      left = parseInt(left)
      top = parseInt(top)
      var viewPos = {width, height, left, top}
      this.$set(this, 'viewPos', viewPos)
    },
    setImg (src) {
      return new Promise((resolve, reject) => {
        this.cutImg.onload = () => {
          resolve()
        }
        this.cutImg.onerror = () => {
          reject(new Error('Img load 404 not found.'))
        }
        this.cutImg.src = src
        this.viewImg.src = src
      })
    },
    handleSelect (e) {
      // console.log(e)
      const img = e.target.files[0]
      // console.log(img)
      const url = window.URL.createObjectURL(img)
      this.imgUrl = url
      this.init()
      // 清空
      e.target.value = ''
    },
    clear () {
      if (this.cutImg) {
        this.cutImg.src = ''
      }
      if (this.viewImg) {
        this.viewImg.src = ''
      }
      this.imgUrl = ''
      this.loaded = false
    },
    async init () {
      this.setImg(this.imgUrl).then(() => {
        // 初始位置信息
        var {width, height, left, top} = this.cut.getBoundingClientRect()
        var cutPos = {width, height, left, top}
        this.setViewPos()
        this.$set(this, 'cutPos', cutPos)
        this.loaded = true
        // console.log(this.cutPos)
        if (typeof this.ctrlWidth !== 'undefined') {
          this.vw = this.ctrlWidth
          // console.log(this.ctrlWidth)
        }
        if (typeof this.ctrlHeight !== 'undefined') {
          this.vh = this.ctrlHeight
        }
        if (typeof this.ctrlTop !== 'undefined') {
          this.vt = this.ctrlTop
        }
        if (typeof this.ctrlLeft !== 'undefined') {
          this.vl = this.ctrlLeft
        }
      }).catch(err => {
        // console.log(err)
        throw err
      })
    }
  },
  created () {
    if (this.src) {
      this.imgUrl = this.src
    }
    if (typeof this.showView !== 'undefined') {
      this.showSelection = this.showView
    }
  },
  mounted () {
    this.cut = this.$refs.cut
    this.view = this.$refs.view
    this.cutImg = this.$refs['cut-img']
    this.viewImg = this.$refs['view-img']
    window.cut = this
    if (this.imgUrl) {
      this.init()
    }
  }
}
</script>
