"use client";
export default function SubmitButton({ publish }: { publish: () => void }) {
  return (
    <button onClick={publish} className='px-4 py-1 bg-teal-500 text-white rounded-md w-28 block ml-auto mr-5 hover:bg-teal-700'>
      publish
    </button>
  );
}
