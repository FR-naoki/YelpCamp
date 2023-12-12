module.exports.isLoggedIn = (req, res, next) => {
    console.log(`req.user`, req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash(`error`, `ログインしてください`);
        return res.redirect(`/login`);
    }
    next();
}