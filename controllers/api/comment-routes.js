const router = require('express').Router();
const { Comment, Post, User } = require('../../models');

router.get('/', (req, res) => {
    Comment.findAll()
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


// CREATE A COMMENT
router.post('/', (req, res) => {
    // if (req.session) {
        Comment.create({
            comment_text: req.body.comment_text,
            user_id: req.body.user_id,
            post_id: req.body.post_id
        })
            .then(dbCommentData => {res.json(dbCommentData)})
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    //}
});


// DELETE A COMMENT 
router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if (!dbCommentData){
            res.status(404).json({ message: 'No comment data found! Please try again later...' });
            return;
        }

        res.json(dbCommentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;