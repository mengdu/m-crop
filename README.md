# vue-m-crop

Vue 简单的图片区域裁切组件。

> 插件尚未发布到 npm, 现在你可以 `npm install git+https://github.com/mengdu/m-crop.git` 安装体验



```js
<template>
<m-crop ref="crop"
  :src="cropConf.src"
  :auto="cropConf.auto"
  :show-view="cropConf.showView"
  :show-ctrl="cropConf.showCtrl"
  :ctrl-width="cropConf.ctrlWidth"
  :ctrl-height="cropConf.ctrlHeight"
  :ctrl-left="cropConf.ctrlLeft"
  :ctrl-top="cropConf.ctrlTop"
  ></m-crop>
</template>
export default {
  data () {
    return {
      cropConf: {
        src: '',
        auto: true,
        showView: true,
        showCtrl: false,
        ctrlWidth: 200,
        ctrlHeight: 200,
        ctrlLeft: 0,
        ctrlTop: 0
      }
    }
  }
}
```


## MCrop Attributes

| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| src     | 图片路径，如果不设置，显示选择图片；图片源一定要当前域下  | string | —  |    —     |
| auto     | 尺寸自由 | boolean | true/false  |  true  |
| show-view     | 显示框选区 | boolean | true/false  |  true  |
| show-ctrl     | 显示尺寸控制按钮 | boolean | true/false  |  true  |
| ctrl-width     | 框选区宽度 | number/string |   —   |  0  |
| ctrl-height     | 框选区高度 | number/string |   —   |  0  |
| ctrl-top     | 框选区top | number/string |   —   |  0  |
| ctrl-left     | 框选区left | number/string |   —   |  0  |
| lock-view-size | 锁定尺寸 | Boolean |  true/false   |  false  |


## MCrop Events


| 名称      | 参数    | 说明      | 
|---------- |-------- |---------- |
| stop     | 当前裁剪信息 | 框选裁切停止触发 |


## MCrop Methods


| 方法      | 参数    | 返回值      | 说明       |
|---------- |-------- |---------- |-------------  |
| clear     | 无  | 无 | 清空  |
| getCutInfo     | 无  | object | 返回裁剪位置信息  |
| getClip     | 无  | Cutter对象 | 返回裁剪 Cutter 对象  |


> 对于非同源的图片，可以使用 `getCutInfo` 获取裁剪信息，然后通过后端进行图片裁切操作


## Cutter

Cutter 是一个图片处理对象，基于 canvas API 实现对图片的处理。

> canvas API 不支持对非同源图片的操作，远程图片，请把图片放到同域下操作。

| 方法      | 参数    | 返回值      | 说明       |
|---------- |-------- |---------- |-------------  |
| zoom(val)     | val 缩放倍数  | 返回Cutter | 缩放图片  |
| size(w, h)     | w 宽度， h 高度  | 返回Cutter | 改变图片尺寸  |
| clip(x, y, w, h) | x 开始x, y 开始y, w 宽度， h 高度  | 返回Cutter | 裁切图片指定区域  |
| toBlob(mime, quality)    | mime 文件类型，默认image/png, quality 质量，0~1  | Promise 返回一个 Blob 对象| 把图片转成Blob  |
| toBase64(mime, quality)      |mime 文件类型，默认image/png, quality 质量，0~1  | Promise 返回一个 Blob 对象 | 把图片转base64  |

> 拿到blob对象后可以通过 multipart/form-data 上传到服务器。
> 返回Blob对象没有文件名，可以通过FileApi 构造一个文件对象  `new File([Blob], 'demo.png',{type: 'image/png'})` 。
