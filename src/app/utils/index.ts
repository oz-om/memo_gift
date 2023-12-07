export function toggleDialog(dialogClass: string) {
  let dialog = document.querySelector(`dialog.${dialogClass}`);
  let d = dialog as HTMLDialogElement;
  if (d.open) {
    d.close();
  } else {
    d.showModal();
  }
  document.body.classList.toggle("overflow-hidden");
  document.body.classList.toggle("sm:overflow-auto");
}
