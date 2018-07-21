const express = require('express');
const passport = require('passport');
const router = express.Router();

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        next();
    } else {
        res.send(403);
    }
}

router.use('/api', passport.authenticate('basic', { session: false }));

router.get('/api/data', ensureAuthenticated, (req, res) => {
    res.json([
        { value: 'foo' },
        { value: 'bar' },
        { value: 'baz' }        
    ]);
});

module.exports = router;