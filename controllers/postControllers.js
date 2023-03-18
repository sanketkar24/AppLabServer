const jwt = require('jsonwebtoken');
require("dotenv").config();
const Post = require('../models/Post');
const { param } = require('../routes/postRoutes');
exports.regUser = async (req, res, next) => {
    try {
        let obj = req.body;
        console.log(obj)
        let val = await Post.register(obj.name, obj.username, obj.password, obj.college, obj.email, obj.year, obj.interested_in, obj.photo );
        if (val != 1) val = 0;
        return res.json({
            success: val
        })
        res.status(200).json({ message: "sent" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.login = async (req, res, next) => {
    console.log('Login trying now')
    try {
        let obj = req.body;
        let result = await Post.login(obj.username, obj.password);
        console.log("token: " + result)
        if (result == null) {
            sucvar = 0;
            msg = "WRONG USERNAME PASSWORD"
        }
        else {
            sucvar = 1;
            msg = "Login successful"
        }
        return res.json({
            success: sucvar,
            message: msg,
            token: result
        })
        res.status(200).json({ message: "sent" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.StartupLogin = async (req, res, next) => {
    console.log('Login trying now')
    try {
        let obj = req.body;
        let result = await Post.StartupLogin(obj.username, obj.password);
        console.log("token: " + result)
        if (result == null) {
            sucvar = 0;
            msg = "WRONG USERNAME PASSWORD"
        }
        else {
            sucvar = 1;
            msg = "Login successful"
        }
        return res.json({
            success: sucvar,
            message: msg,
            token: result
        })
        res.status(200).json({ message: "sent" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.reset = async (req, res, next) => {
    try {
        let obj = req.body;
        let result = await Post.reset(obj.username, obj.password, obj.newpassword);
        return res.json({
            result: result
        })
        res.status(200).json({ message: "sent" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.findStartupByID = async (req, res, next) => {
    try {
        let [val,_] = await Post.findStartup(req.body.startup_id);
        res.status(200).json({ val });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.listMentors = async (req, res, next) => {
    try {
        let val = await Post.listMentors();
        console.log(val);
        let result = val.mentors
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.insertUpdateMsg = async (req, res, next) => {
    try {
        let obj = req.body;
        let [val, _] = await Post.insertUpdateMsg(obj.startup_id, obj.msg, obj.extra_links);
        let message = (val.affectedRows>=1? "success" : "false")
        res.status(200).json({ message });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.findMovieByName = async (req, res, next) => {
    try {
        let name = req.params.name;
        let [val, _] = await Post.findByName(name);
        res.status(200).json({ val });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.getReview = async (req, res, next) => {
    try {
        let id = req.params.id;
        let [val, _] = await Post.getRev(id);
        res.status(200).json({ val });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.insertHiringMessage = async (req, res, next) => {
    try {
         console.log('inserting hiring message')
         let [results, _] = await Post.insertHiringMessage(req)
        res.status(200).json(results);
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.getPop = async (req, res, next) => {
    try {
        let [results, _] = await Post.getPopMovie();
        res.status(200).json({ page: 1, results, total_pages: 35456, total_results: 709112 });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.getById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let [results, _] = await Post.getMovieByID(id);
        res.status(200).json({ results });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.getByGenre = async (req, res, next) => {
    try {
        let genre = req.params.genre;
        let [results, _] = await Post.getMovieByGenre(genre);
        res.status(200).json({ results });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.getUser = async (req, res, next) => {
    try {
        let token = req.get("authorization");
        if (token) {
            token = token.slice(7)
            jwt.verify(token, process.env.ACCESS_KEY, async (err, decoded) => {
                if (err) {
                    res.json({
                        success: 0,
                        message: "Invalid token"
                    });
                }
                else {
                    let [val,_] = await Post.getUserInfo(decoded.result.username, decoded.result.password)
                    res.json({val})
                }
            })
        } else {
            res.json({
                success: 0,
                message: "access denied! Unauthorized user!"
            })
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.    getStartup = async (req, res, next) => {
    try {
        let token = req.get("authorization");
        if (token) {
            token = token.slice(7)
            jwt.verify(token, process.env.ACCESS_KEY, async (err, decoded) => {
                if (err) {
                    res.json({
                        success: 0,
                        message: "Invalid token"
                    });
                }
                else {
                    let [val,_] = await Post.getStartupUserInfo(decoded.result.username, decoded.result.password)
                    res.json({val})
                }
            })
        } else {
            res.json({
                success: 0,
                message: "access denied! Unauthorized user!"
            })
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}


exports.getPastServices = async (req, res, next) => {
    try {
        let token = req.get("authorization");
        if (token) {
            token = token.slice(7)
            jwt.verify(token, process.env.ACCESS_KEY, async (err, decoded) => {
                if (err) {
                    res.json({
                        success: 0,
                        message: "Invalid token"
                    });
                }
                else {
                    let [val,_] = await Post.getStartupUserInfo(decoded.result.username, decoded.result.password)
                    // res.json({val})

                    console.log(val);
                    let [serviceHistory,abc] = await Post.getPastServices(val[0].startup_id)
                    let status_msg = serviceHistory.status =='Y'? 'Accepted' : serviceHistory.status == 'N'? 'Rejected' : 'Pending'
                    serviceHistory.status = status_msg
                    res.json({serviceHistory})

                }
            })
        } else {
            res.json({
                success: 0,
                message: "access denied! Unauthorized user!"
            })
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.getPastHiring = async (req, res, next) => {
    try {
        let token = req.get("authorization");
        if (token) {
            token = token.slice(7)
            jwt.verify(token, process.env.ACCESS_KEY, async (err, decoded) => {
                if (err) {
                    res.json({
                        success: 0,
                        message: "Invalid token"
                    });
                }
                else {
                    let [val,_] = await Post.getStartupUserInfo(decoded.result.username, decoded.result.password)
                    // res.json({val})

                    console.log(val);
                    let [pastHiring,abc] = await Post.getPastHiring(val[0].startup_id)
                    res.json({pastHiring})

                }
            })
        } else {
            res.json({
                success: 0,
                message: "access denied! Unauthorized user!"
            })
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}


exports.getFeedback = async (req, res, next) => {
    try {
        let token = req.get("authorization");
        if (token) {
            token = token.slice(7)
            jwt.verify(token, process.env.ACCESS_KEY, async (err, decoded) => {
                if (err) {
                    res.json({
                        success: 0,
                        message: "Invalid token"
                    });
                }
                else {
                    let [val,_] = await Post.getStartupUserInfo(decoded.result.username, decoded.result.password)
                    // res.json({val})

                    console.log(val);
                    let [feedback,abc] = await Post.getFeedback(val[0].startup_id)
                    res.json({feedback})

                }
            })
        } else {
            res.json({
                success: 0,
                message: "access denied! Unauthorized user!"
            })
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.insertServices = async (req, res, next) => {
    try {
        let token = req.get("authorization");
        if (token) {
            token = token.slice(7)
            jwt.verify(token, process.env.ACCESS_KEY, async (err, decoded) => {
                if (err) {
                    res.json({
                        success: 0,
                        message: "Invalid token"
                    });
                }
                else {
                    let [val] = await Post.getStartupUserInfo(decoded.result.username, decoded.result.password)
                    // res.json({val})
                    let result = await Post.insertServices(val[0].startup_id, req)
                    
                    res.json({result})

                }
            })
        } else {
            res.json({
                success: 0,
                message: "access denied! Unauthorized user!"
            })
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.insertHiring = async (req, res, next) => {
    try {
        let token = req.get("authorization");
        if (token) {
            token = token.slice(7)
            jwt.verify(token, process.env.ACCESS_KEY, async (err, decoded) => {
                if (err) {
                    res.json({
                        success: 0,
                        message: "Invalid token"
                    });
                }
                else {

                    
                    let [val] = await Post.getStartupUserInfo(decoded.result.username, decoded.result.password)
                     console.log(val)
                    //let result = await Post.insertServices(val[0].startup_id, req)
                    let result = await Post.insertHiring(val[0].startup_id,req)
                    console.log(result)
                    res.json({result})

                }
            })
        } else {
            res.json({
                success: 0,
                message: "access denied! Unauthorized user!"
            })
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.getAllServices = async (req, res, next) => {
    try {
        let [result,_] = await Post.getAllServices()
        res.status(200).json({ result });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.getAllHiring = async (req, res, next) => {
    try {
        let [result,_] = await Post.getAllHiring()
        res.status(200).json({ result });
    } catch (error) {
        console.log(error);
        next(error);
    }
}


exports.registerStartup = async (req, res, next) => {
    try {
        let val = await Post.registerStartup(req)
        let msg = val == 1? 'success':'failed'
        res.status(200).json({ msg });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.getCount = async (req, res, next) => {
    try {
        var id = req.params.id;
        let [results, _] = await Post.getCount(id);
        res.status(200).json({ results });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
exports.getCast = async (req, res, next) => {
    try {
        var id = req.params.id;
        let [results, _] = await Post.getCastMovie(id);
        res.status(200).json({ results });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

