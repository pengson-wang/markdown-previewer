import { BehaviorSubject } from 'rxjs'

class Previewer {
  enabled: BehaviorSubject<boolean>
  constructor() {
    this.enabled = new BehaviorSubject<boolean>(false)
  }
  switch() {
    this.enabled.next(!this.enabled.value)
  }
  enable() {
    this.enabled.next(true)
  }
  disable() {
    this.enabled.next(false)
  }
  isEnabled() {
    return this.enabled.getValue()
  }
  isDisabled() {
    return !this.enabled.getValue()
  }
}

const previewer = new Previewer()

export default previewer
