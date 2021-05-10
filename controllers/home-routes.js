const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');




// DASHBOARD ROUTE
router.get('/', (req, res) => {

    console.log(req.session);

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
            res.render('dashboard', { 
                posts,
                loggedIn: req.session.loggedIn
            });
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

// SIGNUP PAGE 
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('signup');
});


// HOMEPAGE ROUTE
router.get('/home', (req, res) => {
    if (req.session.loggedIn) {
        Post.findAll({
            where: {
                user_id: req.session.user_id
            },
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
                res.render('homepage', {
                    posts,
                    loggedIn: req.session.loggedIn,
                    username: req.session.username
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    } else {
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
                res.render('homepage', { posts });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    };
});

// SINGLE POST PAGE
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
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
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found here!' });
                return;
            }

            const post = dbPostData.get({ plain: true });

            res.render('singlepost', { 
                post,
                loggedIn: req.session.loggedIn
            });
        });
});


// NEW POST PAGE

router.get('/newpost', (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('/login');
        return;
    }

    res.render('newpost');
});

module.exports = router;