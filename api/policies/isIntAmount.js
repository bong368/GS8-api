module.exports = function(req, res, next) {

    var ticket = req.body;

    var isInt = function(value) {
        var er = /^-?[0-9]+$/;
        return er.test(value);
    }
    
    if (!isInt(ticket.amount)) {
        return res.json(401, { error: 'Your amount must be integer format' });
    } else {
        next();
    };
}
