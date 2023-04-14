export default async function detectTextArea(): Promise<HTMLTextAreaElement> {
  return new Promise((resolve) => {
    function findTextarea() {
      const ta = window.document.querySelector('textarea')
      if (ta) {
        resolve(ta)
      } else {
        window.requestAnimationFrame(findTextarea)
      }
    }
    findTextarea()
  })
}
