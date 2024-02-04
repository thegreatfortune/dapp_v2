import toCurrencyString from "./convertToCurrencyString"

export const handleImageCanvas = async (imagePath: string, drawList: [Name: string, Lender: string, Loan: string, RiskLevel: string, Interest: string, Dividend: string]): Promise<File | null> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const [Name, Lender, Loan, RiskLevel, Interest, Dividend] = drawList

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
    image.src = imagePath

    image.onload = () => {
      // 将图像绘制到画布上
      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      // 添加多行文本到图像上
      const lines = [
        `Loan: $ ${toCurrencyString(Number(Loan))}`,
        `Risk Level: ${RiskLevel}`,
        `Interest: ${Interest}`,
        `Dividend: ${Dividend}`,
      ]
      const lineHeight = 44 // 行高
      const startY = 130 // 起始 Y 坐标
      const startX = 90 // 起始 X 坐标

      context.font = '14px Arial'
      context.fillStyle = 'white'

      context.fillText(`Name:${Name}`, startX, startY - 70)
      context.fillText(`Borrower:${Lender}`, startX, startY - 50)

      lines.forEach((line, index) => {
        const y = startY + index * lineHeight
        context.fillText(line, startX, y)
      })

      canvas.toBlob((blob) => {
        if (blob) {
          const newFile = new File([blob], 'processed-image.png', { type: 'image/png' })
          resolve(newFile)
        }
        else {
          reject(new Error('Failed to create Blob.'))
        }
      }, 'image/png')
    }

    image.onerror = (error) => {
      reject(new Error(`Error loading image: ${error}`))
    }
  })
}
