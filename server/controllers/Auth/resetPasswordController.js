import * as db from "../../models/db.js";

export default async function resetPasswordController(req, res) {
  const { token } = req.params;
  const { oldPswd, newPswd, confirmPswd } = req.body;
}
