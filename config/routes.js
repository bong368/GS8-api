/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 */

module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home page.              *
     *                                                                          *
     ***************************************************************************/

    '/': {
        view: 'main'
    },

    '/play-game': 'ViewController.playGame',

    // Authenticate Area 
    'POST /api/authenticate': 'AuthController.authenticate',
    'POST /api/authenticate/create': 'AuthController.register',
    'GET /api/authenticate/user': 'AuthController.user',
    'PUT /api/authenticate/password/reset': 'AuthController.changePassword',
    'GET /api/user/credit': 'UsersController.getCreditUserInfo',
    'GET /api/user/game': 'AuthController.games',

    // Banking Area
    'GET /api/banking/all': 'BankingController.index',
    'GET /api/transaction/limit': "LimitTransactionController.index",

    // Transaction Area
    'PUT /api/cashier/deposit': 'DepositsController.create',
    'PUT /api/cashier/withdrawn': 'WithdrawnsController.create',
    'PUT /api/cashier/transfer': 'TransfersController.create',
    'GET /api/transfer/bonus': 'BonusController.getTransferBonus',
    'GET /api/deposit/bonus': 'BonusController.getDepositBonus',

    // Report Area
    'POST /api/transaction/report/deposit': 'DepositsController.index',
    'POST /api/transaction/report/withdrawn': 'WithdrawnsController.index',
    'POST /api/transaction/report/transfer': 'TransfersController.index',
    'POST /api/bonus/report': 'BonusController.getUserBonus',

    // Gamesite Area 
    'GET /api/game/all/title': 'GameController.getTitle',

    //(WFT Sporkbook)
    'GET /api/wft/signin': 'WftController.signin',
    'GET /api/wft/turnOver': 'WftController.turnOver',

    //(PlayTech)
    'GET /api/slot/playtech': 'PlaytechController.getAllGame',
    'POST /api/playtech/signin': 'PlaytechController.signin',
    'PUT /api/playtech/password': 'PlaytechController.updatePassword',
    
    //(AllBet)
    'POST /api/allbet/signin': 'AllBetController.signin',
    'PUT /api/allbet/password': 'AllBetController.updatePassword',
    'POST /api/allbet/createAnonymous': 'AllBetController.createAnonymous',

    //(GamePlay)
    'GET /api/slot/gameplay': 'GamePlayController.getAllGame', 
    'POST /api/gameplay/anonymous': 'GamePlayController.createAnonymous',
    'GET /gameplay/authencation': 'GamePlayController.authencation',
    'POST /api/gameplay/mobile/authentication': 'GamePlayController.createToken',

    // Sync All account
    'PUT /api/authenticate/sync': 'AuthController.syncAll',

    // Test Api Area
    'POST /api/test': 'TestController.test',
    'GET /api/queryHandicap': 'TestController.queryHandicap',
    // Test Api Area
    'POST /api/curl': 'TestController.runCurl',

    // Provide API for admin
    'PUT /api/user/password': 'UsersController.updatePassword'
};
