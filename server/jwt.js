import jwt from "jsonwebtoken";

const createTokens = (user) => {
    const accessToken = jwt.sign(
        { email: user.email, id: user.id, role: user.role },
        "jwtsecret"
    );

    return accessToken;
};

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"];

    try {
        if (accessToken) {
            const validToken = jwt.verify(accessToken, "jwtsecret");
            if (validToken) {
                req.authenticated = true;
                req.userId = validToken.id;
                req.userRole = validToken.role;
                return next();
            }
        }

        req.authenticated = false;
        req.userId = null;
        req.userRole = null;
        return next();
    } catch (err) {
        return res.status(498).json({ error: "Invalid access token." });
    }
};

const checkAuthorization = (req, res, next) => {
    const accessToken = req.cookies["access-token"];

    if (accessToken) {
        try {
            const decodedToken = jwt.verify(accessToken, "jwtsecret");
            const userRole = decodedToken.role;

            if (userRole === "koordinator") {
                // Perform authorized actions for the role
                next();
            } else {
                // Handle unauthorized actions
                res.status(403).json({
                    error: "User is not authorized.",
                });
            }
        } catch (err) {
            // Handle the case when the access token is invalid or expired
            res.status(498).json({ error: "Invalid access token." });
        }
    } else {
        // Handle the case when the access token is not present in the cookies
        res.status(401).json({ error: "Access token not found." });
    }
};


//for access to all roles
const checkAuthorization2 = (allowedRoles) => (req, res, next) => {
    const accessToken = req.cookies["access-token"];

    if (!accessToken) {
        return res.status(401).json({ error: "Access token not found." });
    }

    try {
        const decodedToken = jwt.verify(accessToken, "jwtsecret");
        const userRole = decodedToken.role;

        //console.log("Decoded Token:", decodedToken);  
        //console.log("User Role:", userRole);

        if (allowedRoles.includes(userRole)) {
            req.userId = decodedToken.id;
            req.userRole = userRole;
            return next();
        }
        else {
            return res.status(403).json({ error: "User is not authorized." });
        }
    }
    catch (err) {
        return res.status(498).json({ error: "Invalid access token." });
    }
};



export { createTokens, validateToken, checkAuthorization, checkAuthorization2 };