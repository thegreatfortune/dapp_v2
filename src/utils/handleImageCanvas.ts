export const handleImageCanvas = async (file: File): Promise<File | null> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = 334
    canvas.height = 290

    const context = canvas.getContext('2d')
    if (!context) {
      reject(new Error('Unable to get 2D context for canvas'))
      return
    }

    // 加载图像
    const image = new Image()
    image.src = URL.createObjectURL(file)

    image.onload = () => {
      // 将图像绘制到画布上
      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      // 添加文本到图像上
      context.font = '20px Arial'
      context.fillStyle = 'white'
      context.fillText('Your Text Here', 10, 30)

      // 转换 canvas 到数据 URL
      const imageDataUrl = canvas.toDataURL('image/png')

      // 将数据 URL 转换为 Blob，并创建新的 File 对象
      fetch(imageDataUrl)
        .then(res => res.blob())
        .then((blob) => {
          const newFile = new File([blob], file.name, { type: 'image/png' })
          resolve(newFile)
        })
        .catch(err => reject(err))
    }
  })
}
