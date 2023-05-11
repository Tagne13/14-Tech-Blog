// Redirect request to login route if user not logged in
const withAuth = (req, res, next) => {
    if(!req.session.logged_in) {
        res.redirect('/login');
    } else {
        next();
    }
};

module.exports = withAuth;