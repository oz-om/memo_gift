export default function Auth_provider({ icon, bg }: { [key: string]: string }) {
  return (
    <li className='flex flex-col items-center cursor-pointer'>
      <i className={icon + " bx bx-border-circle text-white hover:scale-105 transition-[transform] " + bg}></i>
    </li>
  );
}
