import { createCanvas, loadImage } from 'canvas'

export const handleImageCanvas = async (file: File) => {
  if (file) {
    const canvas = createCanvas(300, 200) // Set canvas size as needed
    const context = canvas.getContext('2d')

    // Load the image
    const image = await loadImage(URL.createObjectURL(file))

    console.log(`<img src="${canvas.toDataURL()}" />`)

    // Draw the image onto the canvas
    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    // Add text to the image
    context.font = '20px Arial'
    context.fillStyle = 'white'
    context.fillText('Your Text Here', 10, 30)

    // Convert the canvas to a data URL
    const imageDataUrl = canvas.toDataURL('image/png')
    console.log('%c [ imageDataUrl ]-23', 'font-size:13px; background:#ec1b6b; color:#ff5faf;', imageDataUrl)
  }
}
