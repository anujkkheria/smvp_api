export const Logger = async (req, res, next) => {
  // if (error) {
  //   console.log("testing for error", error);
  // }
  next()
  console.log('req', req.originalUrl, req.body)
}
