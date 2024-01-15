const MINS_DISCOUNT = 15
const MILLIS_IN_MIN = 60000

function timeUntilDiscount(orderTime) {
  const millis = MINS_DISCOUNT * MILLIS_IN_MIN;

  const timeDiff = Date.now() - orderTime
  const timeDiffMins = timeDiff/MILLIS_IN_MIN

  return MINS_DISCOUNT - Math.ceil(timeDiffMins)
}

function discountMessage(orderTime, lateMsg) {
  const timeLeft = timeUntilDiscount(orderTime)
  if (timeLeft <= 0) {
    return lateMsg
  } else {
    return timeLeft + " minutes"
  }
}

module.exports = {timeUntilDiscount, discountMessage}
