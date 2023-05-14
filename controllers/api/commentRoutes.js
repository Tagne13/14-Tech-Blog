const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET all comments
router.get('/', async (req, res) => {
    try {
        const commentData = await Comment.findAll();
        res.status(200).json(postData)
    } catch (err) {
        res.status(500).json(err);
    }
});

// Route to CREATE a comment for a user (needs to be logged in)
router.post('/', withAuth, async (req, res) => {
    try {
        const newComment = await Comment.create({
            ...req.body, 
            user_id: req.session.user_id
        });

        res.status(200).json(newComment);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Route to UPDATE a comment for a user (needs to be logged in)
router.put('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.update(req.body, {
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            },
        });
        if (!commentData) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
        }
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Route to DELETE a comment for a user (needs to be logged in)
router.delete('/:id', withAuth, async (req, res) => {
    try {
         const commentData = await Comment.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            },
         });

         if (!commentData) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
         }
         res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
 });

 module.exports = router;