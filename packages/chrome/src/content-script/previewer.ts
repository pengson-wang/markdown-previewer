import { BehaviorSubject } from 'rxjs'

class Previewer {
  enabled: BehaviorSubject<boolean>
  constructor() {
    this.enabled = new BehaviorSubject<boolean>(false)
  }
  onSwitch() {
    this.enabled.next(!this.enabled.value)
  }
}

const previewer = new Previewer()

export default previewer
