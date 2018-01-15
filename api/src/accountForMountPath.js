module.exports = function accountForMountPathHOF (microFn) {
  return function accountForMountPath (req, res, ...args) {
    // If mounted on a path (like /api), remove it
    if (process.env.MY_APP_API_MOUNT_PATH) {
      req.url = req.url.replace(process.env.MY_APP_API_MOUNT_PATH, '')
    }

    return microFn(req, res, ...args)
  }
}
