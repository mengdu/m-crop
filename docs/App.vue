<template>
  <div id="app">
    <fork-link :repo="repo" />
    <header>
      <img src="./assets/logo.png">
      <h1>{{pkg.name}} <span>{{pkg.version}}</span></h1>
      <p>{{pkg.description}}</p>
      <div class="text-center" style="padding: 15px;">
        <a :href="repo" target="_blank">
          <m-button type="info" size="large" round>
            <img src="https://avatars1.githubusercontent.com/u/11366654?s=40&v=4" class="user-img" alt="mengdu">
            Github
          </m-button>
        </a>
        &nbsp;
        <a href="#example"><m-button type="warning" size="large" plain round>Example</m-button></a>
      </div>
    </header>
    <main class="doc-block">
      <m-crop ref="crop"
        :src="cropConf.src"
        :auto="cropConf.auto"
        :show-view="cropConf.showView"
        :show-ctrl="cropConf.showCtrl"
        :ctrl-width="cropConf.ctrlWidth"
        :ctrl-height="cropConf.ctrlHeight"
        :ctrl-left="cropConf.ctrlLeft"
        :ctrl-top="cropConf.ctrlTop"
        :lock-view-size="cropConf.lockViewSize"
        ></m-crop>
      <div style="padding: 15px;">
        <label><input type="checkbox" v-model="cropConf.auto">自由裁剪</label>
        <label><input type="checkbox" v-model="cropConf.showView">显示裁剪区</label>
        <label><input type="checkbox" v-model="cropConf.showCtrl">显示裁剪控制按钮</label>
        <label><input type="checkbox" v-model="cropConf.lockViewSize">锁定尺寸</label>
        <p>
          <label>宽：<input type="number" class="m-form-control" v-model="cropConf.ctrlWidth"></label>
          <label>高：<input type="number" class="m-form-control" v-model="cropConf.ctrlHeight"></label>
        </p>
        <p>
          <label>left：<input type="number" class="m-form-control" v-model="cropConf.ctrlLeft"></label>
          <label>top：<input type="number" class="m-form-control" v-model="cropConf.ctrlTop"></label>
        </p>
        
        <m-button type="info" @click="preview">预览</m-button>
        <m-button type="success" @click="save">保存</m-button>
        <m-button type="danger" @click="crop.clear()">清空</m-button>
      </div>
      <readme></readme>
      <!-- <Doc/> -->
    </main>
    <layout-footer></layout-footer>

    <m-dialog
      title="预览截图"
      class="preview-box"
      :show.sync="showPreview"
      >
      <img :src="tempUrl" />
    </m-dialog>

  </div>
</template>

<script>
import LayoutFooter from './components/footer'
import ForkLink from './components/fork-link'
import Doc from './doc.md'
import Readme from '~/README.md'
import pkg from '~/package.json'
import imgcutter from '@/img-cutter'

window.imgcutter = imgcutter
import bg from './assets/bg.png'

function download (url, fileName) {
  let a = document.createElement('A')
  a.href = url
  a.download = fileName
  a.style.display = 'none'
  // for firfox
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    a.remove()
  }, 1000)
}

export default {
  name: 'App',
  components: {
    Doc,
    LayoutFooter,
    ForkLink,
    Readme
  },
  data () {
    return {
      pkg,
      showPreview: false,
      tempUrl: '',
      cropConf: {
        // src: 'http://oogfn666s.bkt.clouddn.com/52746047c7a81a0dd797a2bf1ca91e98.png',
        // src: 'https://avatars1.githubusercontent.com/u/11366654?s=40&v=4',
        // src: bg,
        src: '',
        auto: true,
        showView: true,
        showCtrl: false,
        ctrlWidth: 200,
        ctrlHeight: 200,
        ctrlLeft: 0,
        ctrlTop: 0,
        lockViewSize: false
      }
    }
  },
  computed: {
    repo () {
      return pkg.repository.url.replace(/git\+/, '')
    }
  },
  methods: {
    preview () {
      this.crop.getClip().then(img => {
        img.toBlob().then(blob => {
          console.log(blob)
          var url = URL.createObjectURL(blob)
          this.tempUrl = url
          this.showPreview = true
          console.log(url)
        })
      })
    },
    save () {
      this.crop.getClip().then(img => {
        img.toBlob().then(blob => {
          console.log(blob)
          var url = URL.createObjectURL(blob)
          download(url, 'clip-' + (new Date()).getTime() + '.png')
        })
      })
    }
  },
  mounted () {
    this.crop = this.$refs['crop']
    window.crop = this.crop
  }
}
</script>
<style>
  .preview-box{
    text-align: center;
  }
  .preview-box .m-dialog{
    width: auto;
    display: inline-block;
    margin: 0 auto;
    margin-top: 50px;
  }
</style>
