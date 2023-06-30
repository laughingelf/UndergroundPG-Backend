const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log('this is the TOKEN:::', token)
    if (!token || token === "null") {
        return res.status(400).json({ message: "Token not found" });
    }
    console.log('made it to line 9')
    try {
        const tokenInfo = jwt.verify(token, process.env.SECRET);

        console.log('th is TOKENINFO', tokenInfo)
        req.user = tokenInfo;
        next();
    } catch (error) {
        console.log(error.message, "Error.message")
        return res.status(401).json(error);
    }

};

module.exports = isAuthenticated;