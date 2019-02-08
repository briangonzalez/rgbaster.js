
export const getContext = (width, height) => {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('width', width)
  canvas.setAttribute('height', height)
  return canvas.getContext('2d')
}

export const getImageData = (src: string, scale: number = 1): Promise<Uint8ClampedArray> => {
  const img = new Image()

  // Can't set cross origin to be anonymous for data url's
  // https://github.com/mrdoob/three.js/issues/1305
  if (!src.startsWith('data')) img.crossOrigin = 'Anonymous'

  return new Promise((resolve, reject) => {
    img.onload = function () {
      const width = img.width * scale
      const height = img.height * scale
      const context = getContext(width, height)
      context.drawImage(img, 0, 0, width, height)

      const { data } = context.getImageData(0, 0, width, height)
      resolve(data)
    }

    const errorHandler = () => reject(new Error('An error occurred attempting to load image'))

    img.onerror = errorHandler
    img.onabort = errorHandler
    img.src = src
  })
}

export const getCounts = (data: Uint8ClampedArray, ignore: string[]): [] => {
  const countMap = {}

  for (let i = 0; i < data.length; i += 4 /* 4 gives us r, g, b, and a*/) {
    let alpha: number = data[i + 3]
    // skip FULLY transparent pixels
    if (alpha === 0) continue

    let rgbComponents: number[] = Array.from(data.subarray(i, i + 3))

    // skip undefined data
    if (rgbComponents.indexOf(undefined) !== -1) continue

    let color: string = alpha && alpha !== 255
      ? `rgba(${[...rgbComponents, alpha].join(',')})`
      : `rgb(${rgbComponents.join(',')})`

    // skip colors in the ignore list
    if (ignore.indexOf(color) !== -1) continue

    if (countMap[color]) {
      countMap[color].count++
    } else {
      countMap[color] = { color, count: 1 }
    }
  }

  const counts = Object.values(countMap) as []
  return counts.sort((a: any, b: any) => b.count - a.count)
}
