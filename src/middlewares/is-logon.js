export const interceptorLogon = (req, res, next) => {
  if(req.session.hasOwnProperty('data')) {
    console.log(req.session.data.user.type)
    if(req.session.data.user.type) {
      return res.redirect('/admin');
    } 
    return res.redirect('/tickers');
  }

  next()
}