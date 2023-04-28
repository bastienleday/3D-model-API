const express = require("express");

const router = express.Router();

const userRouter = require("./userRouter");
const modelRouter = require("./modelRouter");

const categoryRouter = require("./categoryRouter");
const likesRouter = require("./likesRouter");


/**
 * @description - centralize all routes
 * @method - use
 * @param {string} "/api/user" - path for user routes
 * @param {object} userRouter - user routes
 * @param {string} "/api/model" - path for model routes
 * @param {object} modelRouter - model routes
 * @param {string} "/api/category" - path for category routes
 * @param {object} categoryRouter - category routes
 * @param {string} "/api/likes" - path for likes routes
 * @param {object} likesRouter - likes routes
 */
router.use("/api/user", userRouter);
router.use("/api/model", modelRouter);
router.use("/api/category", categoryRouter);


router.use("/api/likes", likesRouter);

/**
 * @description - export the router
 */
module.exports = router;
