const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');




// DASHBOARD ROUTE
router.get('/', (req, res) => {

    // console.log(req.session);

    Post.findAll({
        attributes: [
            'id',
            'post_text',
            'title',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            const posts = dbPostData.map(post => post.get({ plain: true }));
            res.render('dashboard', { posts });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//LOGIN PAGE
router.get('/login', (req, res) => {
    if(req.session.loggedIn) {
        console.log('User already logged in!');
        res.redirect('/');
        return;
    }

    res.render('login');
});


// // HOMEPAGE ROUTE
// router.get('/home', (req, res) => {

// })


module.exports = router;