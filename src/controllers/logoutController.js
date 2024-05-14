export function handleLogout(req, res) {
  res.clearCookie("token").redirect("/");
}