import express from 'express';

const router = express.Router();

router.get("/users", (req, res) => {
    res.send("Got all users");
})

export default router;