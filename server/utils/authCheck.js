// Check login session
const isLoggedIn = (req, res, next) => {
    if(req.session.user) {
        next();
    } else {
        res.redirect('/users/login');
    }
}

export default isLoggedIn;