import {
  getImageData,
  getCounts
} from './helpers'

interface Opts {
  ignore?: string[]
  scale?: number
  skipTransparentPixels?: boolean
}

const defaultOpts: Opts = {
  ignore: [],
  scale: 1
}

export default async function (src: string, opts: Opts = defaultOpts): Promise<{ color: string, count: number }[] > {
  opts = { ...defaultOpts, ...opts }

  const {
    ignore, // for example, to ignore white and black:  [ 'rgb(0,0,0)', 'rgb(255,255,255)' ]
    scale   // 0 = best performance, lowest fidelity
            // 1 = best fidelity, worst performance
  } = opts

  const data = await getImageData(src, scale)
  return getCounts(data, ignore)
}
