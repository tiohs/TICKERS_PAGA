export const interceptorAdmin = (req, res, next) => {
  if(!!req.session.data.user.type){
    return res.redirect('/admin');
  }
  next()
}