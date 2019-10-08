const router = require('express').Router();
const verify = require('./varifyToken');

router.get('/', verify, (req, res) =>{
    res.json({
        posts:{
            title:'my first post',
            description: 'random data you should not access'  
        }
    });
});

module.exports = router;