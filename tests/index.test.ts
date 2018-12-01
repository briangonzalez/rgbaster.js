import analyze from '../src/index'

const green = 'rgb(126,211,33)'
const red = 'rgb(255,0,0)'

it('gets colors for base64 encoded images', async () => {
  const img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAGhJREFUSA3t0rENgCAABVFxEwdgRRNmZABGEWsoPsWVZ6f5OZMH5e3Pdy1Pq2P5wr/efPKs6I/PnIBV+W/WdrmAbkx4xpGIGkhNScaO1JGIGkhNScaO1JGIGkhNScaO1JGIGkhNScbOBKiIBjchGZzYAAAAAElFTkSuQmCC'
  const result = await analyze(img)

  expect(result[0].count).toEqual(875)
  expect(result[0].color).toEqual(red)

  expect(result[1].count).toEqual(25)
  expect(result[1].color).toEqual(green)
})

it('gets colors for images with a source', async () => {
  const img = 'http://localhost:9080/dominant-red-secondary-green.png'
  const result = await analyze(img)

  expect(result[0].count).toEqual(875)
  expect(result[0].color).toEqual(red)

  expect(result[1].count).toEqual(25)
  expect(result[1].color).toEqual(green)
})

it('ignores a given color for images with a source', async () => {
  const img = 'http://localhost:9080/dominant-red-secondary-green.png'
  const ignoreColors = [ 'rgb(255,0,0)']
  const result = await analyze(img, { ignore: ignoreColors })

  expect(result[0].count).toEqual(25)
  expect(result[0].color).toEqual(green)
})

it('scales images and does less work', async () => {
  const img = 'http://localhost:9080/dominant-red-secondary-green.png'
  const result = await analyze(img, { scale: 0.5 })

  expect(result[0].count).toEqual(216)
  expect(result[0].color).toEqual(red)

  expect(result[1].count).toEqual(4)
  expect(result[1].color).toEqual(green)
})

it('works with jpgs', async () => {
  const img = 'http://localhost:9080/dominant-red-secondary-green.jpg'
  const result = await analyze(img)
  const jpgGreen = 'rgb(126,211,32)'
  const jpgRed = 'rgb(254,0,0)'

  // less fidelity equals less accuracy with jpgs
  expect(result[0].count).toEqual(867)
  expect(result[0].color).toEqual(jpgRed)

  expect(result[1].count).toEqual(10)
  expect(result[1].color).toEqual(jpgGreen)
})

it('gets colors for images with semi transparency', async () => {
  const img = 'http://localhost:9080/dominant-red-secondary-green-transparent.png'
  const result = await analyze(img)

  expect(result[0].count).toEqual(875)
  expect(result[0].color).toEqual('rgba(255,0,0,37)')

  expect(result[1].count).toEqual(25)
  expect(result[1].color).toEqual('rgba(142,184,29,147)')
})

it('skips fully transparent pixels', async () => {
  const img = 'http://localhost:9080/dominant-red-secondary-green-mostly-transparent.png'
  const result = await analyze(img)

  expect(result[0].count).toEqual(4)
  expect(result[0].color).toEqual(red)

  expect(result[1].count).toEqual(3)
  expect(result[1].color).toEqual(green)
})
