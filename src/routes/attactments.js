const attactmentsRouter = require("express").Router();
const db = require("../database");

attactmentsRouter.get("/attactments", async (req, res) => {
    const code = req.query.code;
    try {
        const [rows , ...rest] = await  db.query("SELECT file_url FROM _ce526a619e3f46ae.tabFile where attached_to_doctype ='item' and folder='Home/Attachments' and attached_to_name ='" + code + "'",
        );
        return res.send(rows)
    } catch (er) { }
});

module.exports = attactmentsRouter;
