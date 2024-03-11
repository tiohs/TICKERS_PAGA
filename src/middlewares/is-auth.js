export const interceptorLogin = (req, res, next) => {
  if(!req.session.data){
    return res.redirect('/login');
  }
  if (!req.session.data.isLoggedIn) {
    return res.redirect('/login');   
  }
  next()
}