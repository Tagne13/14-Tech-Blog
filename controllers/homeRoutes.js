const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// GET all posts and join with user data
router.get('/', async (req, res) => {
    try {
      const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });

        const posts = postData.map((post) => post.get({ plain: true }));

        res.render('dashboard', {
            posts
        });
    } catch (err) {
        res.status(500).json(err);
    };
});

router.get('/:id', async (req, res) => {
    try {
        const postData = await Post.findOne({
            where: {
                id: req.params.id,
            },
            attributes: ['id', 'title', 'content'],
            include: [
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'comment_body',
                        'user_id',
                        'post_id'
                    ],
                    include: {
                        model: User,
                        attributes: ['username'],
                    },
                },
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        })

        if (!postData) {
            res.status(404).json({ message: "No post found" });
            return;
        }
    
        const post = postData.get({ plain: true });

        res.render('view', {
            post
        });
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    };
});

// POST a new post
router.get('/post', withAuth, async (req, res) => {
    try {
        const UserData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ["password"] },
            include: [{ model: Post }],
        });

        const user = UserData.get({ plain: true });

        res.render('createPost', {
            ...user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    };
});

// Edit/delete an existing post
router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const UserData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Post }],
        });

        const user = UserData.get({ plain: true });

        res.render('editPost', {
            ...user,
            logged_in: true,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET all comments associated with a specific post
router.get('/comments/:post_id', withAuth, async (req, res) => {
    try {
        const CommentData = await Comment.findAll({
            where: {
                post_id: req.params.post_id
            },
            include: [
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        if (!CommentData) {
            res.status(404).json({ message: "No comments found"});
            return;
        }

        const comments = CommentData.map((comment) => comment.get({ plain: true }));

        res.render('comments', {
            comments: comments,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST a comment
router.get('/comment/:post_id', withAuth, async (req, res) => {
    try {
        const PostData = await Post.findByPk(req.params.post_id, {
            include: [{ model: Comment }]
        });

        const post = PostData.get({ plain: true });

        res.render('createComment', {
            ...post,
            logged_in: true,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Login route
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

// Signup route
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('signup');
});

module.exports = router;