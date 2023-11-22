export default (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            "error": "Пользователь неавторизован",
            "status": "error"
        });
    }
    next();
}