import { observable, action } from 'mobx'
import axios from 'axios'

export default class SampleStore {
  @observable coolMountains = []

  @action doLoadData () {
    return axios.get('/node/api/data')
      .then(res => this.coolMountains.replace(res.data.coolMountains))
  }

  mountainWithId (id) {
    return this.coolMountains.filter(cm => cm.id === id).pop()
  }
}
