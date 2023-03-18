const { json } = require('express');
const db = require('../config/db');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require("dotenv").config();
class Post {
    static register(name, username, password, college, email, year, interested_in, photo) {
        let sql = `SELECT COUNT(username) as count FROM UserProfile WHERE username = '${username}';`;
        return db.query(sql).then(async ([row]) => {
            console.log(row[0].count)
            if (row[0].count != 0) {
                //  REGISTERATION NOT POSSIBLE
                console.log("NOT UNIQUE USERNAME")
            }
            else {
                // INSERT into TABLE
                const hashedPassword = await bcrypt.hash(password, 10)
                console.log(hashedPassword)
                let ins = `INSERT INTO UserProfile(username, password, name, email, college, year, interested_in, photo) values(?,?,?,?,?,?,?,?);`;
                let interest_in = interested_in == 'true' ? 1:0;
                let res = [username, hashedPassword, name, email, college, year, interest_in, photo];
                return db.query(ins, res).then(([row]) => {
                    return 1
                }).catch(error => {
                    throw error;
                })
            }
        }).catch(error => {
            throw error;
        })
    };
    static async login(username, password) {
        let sql = `SELECT COUNT(username) as count FROM UserProfile WHERE username = '${username}';`;
        return db.query(sql).then(([row]) => {
            console.log(row[0].count)
            if (row[0].count == 0) {
                //  WRONG USERNAME AND PASSWORD
                console.log("INVALID CREDENTIALS")
            }
            else {
                // LOGIN
                let ins = `SELECT * FROM UserProfile WHERE username = '${username}';`;
                return db.query(ins).then(async ([row]) => {
                    try {
                        if (await bcrypt.compare(password, row[0].password)) {
                            console.log(row[0])
                            var jsonToken = jwt.sign({ result: { username: row[0].username, password: password } }, process.env.ACCESS_KEY)
                            return jsonToken
                        }
                    } catch (error) {
                        console.log("WRONG PASSWORD")
                        return "wrong password"
                    }
                }).catch(error => {
                    throw error;
                })
            }
        }).catch(error => {
            throw error;
        })
    }
    static async StartupLogin(username, password) {
        let sql = `SELECT COUNT(username) as count FROM startup WHERE username = '${username}';`;
        return db.query(sql).then(([row]) => {
            console.log(row[0].count)
            if (row[0].count == 0) {
                //  WRONG USERNAME AND PASSWORD
                console.log("INVALID CREDENTIALS")
            }
            else {
                // LOGIN
                let ins = `SELECT * FROM startup WHERE username = '${username}';`;
                return db.query(ins).then(async ([row]) => {
                    try {
                        if (await bcrypt.compare(password, row[0].password)) {
                            console.log(row[0])
                            var jsonToken = jwt.sign({ result: { username: row[0].username, password: password } }, process.env.ACCESS_KEY)
                            return jsonToken
                        }
                    } catch (error) {
                        console.log("WRONG PASSWORD")
                        return "wrong password"
                    }
                }).catch(error => {
                    throw error;
                })
            }
        }).catch(error => {
            throw error;
        })
    }
    static reset(username, password, newpassword) {
        let sql = `SELECT COUNT(username) as count FROM UserProfile WHERE username = '${username}';`;
        return db.query(sql).then(async ([row]) => {
            console.log(row[0].count)
            if (row[0].count == 0) {
                //  WRONG USERNAME AND PASSWORD
                console.log("username doesn't exist")
            }
            else {
                let check = `SELECT * FROM UserProfile WHERE username = '${username}';`;
                return db.query(check).then(async ([row]) => {
                    try {
                        if (await bcrypt.compare(password, row[0].password)) {
                            const hashedPassword = await bcrypt.hash(newpassword, 10)
                            console.log(hashedPassword)
                            let upd = `UPDATE UserProfile 
                            SET password = '${hashedPassword}'
                            WHERE username = '${username}';`;
                            return db.query(upd).then(([row]) => {
                                return "SUCCESSFUL";
                            }).catch(error => {
                                throw error;
                            })
                        }
                        else {
                            return "WRONG PASSWORD"
                        }
                    } catch (error) {
                        throw error;
                    }
                }).catch(error => {
                    throw error;
                })
            }
        }).catch(error => {
            throw error;
        })
    }
    //FIND MOVIES BY WORK ID
    static findStartup(startup_id) {
        let sql = `select * from startup where startup_id = ${startup_id};`;
        return db.execute(sql);
    }
    //GET MOVIE INFO BY WORK ID
    static async listMentors() {
        let query = `select * from MentorDetails`;
        return db.query(query).then(([result]) => {
            const returnResult = {
                mentors: result
            }
            return returnResult;
        }).catch(error => {
            throw error;
        })
    }
    static insertUpdateMsg(startup_id, message, extra_links) {
        let extra_links_processed = extra_links.join();
        let sql = `INSERT INTO UpdateMsg(startup_id,message,extra_links) values(?,?,?);`;
        var param = [startup_id, message, extra_links_processed];
        return db.execute(sql, param);
    }
    static findByName(name) {
        let sql = `SELECT * FROM MovieDB
             where LOWER(original_title) LIKE LOWER('%${name}%');`;
        return db.execute(sql);
    }
    static getRev(id) {
        let sql = `SELECT * from REVIEW WHERE movie_id ='${id}';`;
        return db.execute(sql);
    }
    static insertHiring(startup_id, req) {
        let sql = `insert into Hiring_Post(startup_id, role, description, dept) values('${startup_id}',
        '${req.body.role}','${req.body.description}','${req.body.dept}');`;
        //return db.execute(sql);
        return db.execute(sql).then(async ([res]) => {
            console.log(res)
            return res.affectedRows>=1 ? 'success':'false'
        }).catch(error => {
            throw error;
        })
    }
    static getPopMovie() {
        let sql = `SELECT * FROM MovieDB;`;
        return db.execute(sql);
    }
    static getMovieByID(movie_id) {
        let sql = `select * from MovieDB WHERE id = '${movie_id}';`;
        return db.execute(sql);
    }
    static getMovieByGenre(genre) {
        let sql = `select * from MovieDB, category where genre='${genre}' and movie_id=id;`;
        return db.execute(sql);
    }
    static getUserInfo(username) {
        let sql = `select * from UserProfile where username='${username}';`;
        return db.execute(sql);
    }
    static getStartupUserInfo(username) {
        let sql = `select * from startup where username='${username}';`;
        return db.execute(sql);
    }
    static getPastServices(startup_id) {
        console.log('startup_id: '+startup_id)
        let sql = `select * from serviceHistory where startup_id='${startup_id}';`;
        return db.execute(sql);
    }

    static getFeedback(startup_id) {
        console.log('startup_id: '+startup_id)
        let sql = `select feedback.*,UserProfile.name,UserProfile.photo from feedback left join UserProfile
        on feedback.student_id = UserProfile.student_id where feedback.startup_id='${startup_id}';`;
        return db.execute(sql);
    }

    static getPastHiring(startup_id) {
        console.log('startup_id: '+startup_id)
        let sql = `select * from Hiring_Post where startup_id='${startup_id}';`;
        return db.execute(sql);
    }


    static insertServices(startup_id, req) {
        
        let sql = `insert into serviceHistory(startup_id, service_id, description) values('${startup_id}',
        '${req.body.service_id}','${req.body.description}');`;
        //return db.execute(sql);
        return db.execute(sql).then(async ([row]) => {
            return row>=1 ? 'success':'false'
        }).catch(error => {
            throw error;
        })
    }

    static getAllServices() {
        
        let sql = `select * from service where type = 1 or type = 3`;
        //return db.execute(sql);
        return db.execute(sql);
    }

    static getAllHiring() {
        
        let sql = `select * from Hiring_Post`;
        //return db.execute(sql);
        return db.execute(sql);
    }


    static registerStartup(req_obj) {
        var req = req_obj.body;
        console.log(req)
        let sql = `SELECT COUNT(username) as count FROM startup WHERE username = '${req.username}';`;
        return db.query(sql).then(async ([row]) => {
            console.log(row[0].count)
            if (row[0].count != 0) {
                //  REGISTERATION NOT POSSIBLE
                console.log("NOT UNIQUE USERNAME")
            }
            else {
                // INSERT into TABLE

                console.log(req.password)
                const hashedPassword = await bcrypt.hash(req.password, 10)
                console.log(hashedPassword)
                let ins = `INSERT INTO startup(username, password, name, description, logo, level, website, sector, email) values(?,?,?,?,?,?,?,?,?);`;
                let res = [req.username, hashedPassword, req.name, req.description, req.logo, req.level, req.website, req.sector, req.email];
                return db.query(ins, res).then(([row]) => {
                    return 1
                }).catch(error => {
                    throw error;
                })

            }
        }).catch(error => {
            throw error;
        })
    }
    static getCount(movie_id) {
        let sql = `select getReviews(${movie_id}) as output`;
        return db.execute(sql);
    }
    static getCastMovie(movie_id) {
        let sql = `select * from cast where movie_id = '${movie_id}'`;
        return db.execute(sql);
    }
}

module.exports = Post;