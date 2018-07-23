import MCrop from './crop'
import './crop.css'

MCrop.install = function (Vue) {
  Vue.component(MCrop.name, MCrop)
}

export default MCrop
