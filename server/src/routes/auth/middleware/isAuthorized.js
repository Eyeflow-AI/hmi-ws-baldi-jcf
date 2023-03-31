const bypassAC = process.env.BYPASS_ACCESS_CONTROL ?? false;

const isAuthorized = (roles) => (req, res, next) => {

    if (bypassAC) {
        next();
    }
    else {
        let tokenPayload = req.app?.auth?.tokenPayload;
        if (tokenPayload) {
            let accessControl = tokenPayload?.payload?.accessControl ?? {};
            let goFurther = false;
            for (let i = 0; i <= roles.length - 1; i++) {
                let getOut = false;
                for (let j = 0; j <= Object.keys(accessControl).length - 1; j++) {
                    if (roles[i] == Object.keys(accessControl)[j]) {
                        goFurther = true;
                        getOut = true;
                        break;
                    }
                }
                if (getOut) {
                    break;
                }
            }
            if (goFurther) {
                next();
            }
            else {
                let err = new Error('Unauthorized');
                err.status = 401;
                next(err);
            };
        }
        else {
            let err = new Error(`Missing token payload`);
            next(err);
        };
    };
};

module.exports = isAuthorized;