async function onDeleteBtnClick(click) {
  const btn = click.currentTarget;
  const targetURL = btn.dataset.url;
  await fetch(targetURL, {
    method: "DELETE"
  });
  window.location.href = window.location.origin;
}