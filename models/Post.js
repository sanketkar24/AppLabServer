const { json } = require('express');
const db = require('../config/db');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require("dotenv").config();
class Post {
    static register(name, username, password, college, gender, year, branch, interested_in, sector) {
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
                let ins = `INSERT INTO UserProfile(username, password, name, gender, college, year, branch, interested_in, sector) values(?,?,?,?,?,?,?,?,?);`;
                let res = [username, hashedPassword, name, gender, college, year, branch, interested_in, sector];
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
    static listMentors(param) {
        let query = `select * from MentorDetails where mentor_id like '?'`;
        let par = [param]
        db.query(query, par).then(([result]) => {
            const returnResult = {
                description: row,
                mentors: result
            }
            console.log(returnResult)
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
    static insertTo(obj) {
        console.log(obj)
        let sql = `INSERT INTO MOVIEDB(adult,backdrop_path, id, original_language, original_title, overview, poster_path, release_date, title, video)
        values(${obj.adult}, '${obj.backdrop_path}', ${obj.id}, '${obj.original_language}', '${obj.original_title}', '${obj.overview}', '${obj.poster_path}', '${obj.release_date}', '${obj.title}', ${obj.video});`;
        return db.execute(sql);
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
    static postReview(username, review, score, movie_id) {
        if (score == '') score = 0;
        let sql = `insert into Review(username, review, submitdate, movie_id, score) values('${username}','${review}',curdate(),${movie_id},${score});`;

        return db.execute(sql);
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