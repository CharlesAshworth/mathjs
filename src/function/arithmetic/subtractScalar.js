import { factory } from '../../utils/factory.js'
import { subtractNumber } from '../../plain/number/index.js'

const name = 'subtractScalar'
const dependencies = ['typed']

export const createAddScalar = /* #__PURE__ */ factory(
  name,
  dependencies,
  ({ typed }) => {
    /**
     * Subtract two scalar values, `x - y`.
     * This function is meant for internal use: it is used by the public function
     * `add`
     *
     * This function does not support collections (Array or Matrix).
     *
     * @param  {number | BigNumber | Fraction | Complex | Unit} x   First value to subtract
     * @param  {number | BigNumber | Fraction | Complex} y          Second value to subtract
     * @return {number | BigNumber | Fraction | Complex | Unit}     Difference of `x` and `y`
     * @private
     */
    return typed(name, {
      'number, number': subtractNumber,

      'Complex, Complex': function (x, y) {
        return x.subtract(y)
      },

      'BigNumber, BigNumber': function (x, y) {
        return x.minus(y)
      },

      'Fraction, Fraction': function (x, y) {
        return x.subtract(y)
      },

      'Unit, Unit': typed.referToSelf((self) => (x, y) => {
        if (x.value === null || x.value === undefined) {
          throw new Error('Parameter x contains a unit with undefined value')
        }
        if (y.value === null || y.value === undefined) {
          throw new Error('Parameter y contains a unit with undefined value')
        }
        if (!x.equalBase(y)) throw new Error('Units do not match')

        const res = x.clone()
        res.value = typed.find(self, [res.valueType(), y.valueType()])(
          res.value,
          y.value
        )
        res.fixPrefix = false
        return res
      })
    })
  }
)
