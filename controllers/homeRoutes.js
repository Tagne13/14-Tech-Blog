const router = require('express').Router();
const { User, Post, Comment } = require('../models');

router.get('/', async (req, res) => {
    try {
      const postData = await Post.findAll({
            attributes: ['id', 'title', 'content'],
            include: [
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'comment_body',
                        'post_id',
                        'user_id'
                    ],
                    include: {
                        model: User,
                        attributes: [
                            'username',
                        ],
                    },
                },
                {
                    model: User,
                    attributes: [
                        'username',
                    ],
                },
            ],
        })

        const post = postData.map((post) => post.get({ plain: true }));

        res.render('feed', {
            post
        });
    } catch (err) {
        console.log(err);
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

router.get('/', async, (req, res) => {
    try {
        res.render('homepage');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('signup');
});


router.get('*', (req, res) => {
    res.status(404).send("Can't go there!");
    // res.redirect('/');
});


module.exports = router;