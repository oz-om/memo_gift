import Image from "next/image";

export default function notFoundPage() {
  return (
    <div className='h-[70vh] grid place-content-center'>
      <div className='error_404 text-3xl text-center'>
        <span>4</span>
        <span className='text-2xl text-teal-400'>0</span>
        <span>4</span>
      </div>
      <Image src={"/images/not-found.svg"} className='w-60 mx-auto' alt={"not found"} width={900} height={900} />
      <p className='text-center text-sm'>sorry we can&apos;t found this page is not found</p>
    </div>
  );
}
