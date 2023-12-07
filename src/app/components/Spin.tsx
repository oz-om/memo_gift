export default function Spin() {
  return (
    <>
      <p className='text-center text-slate-400'>loading...</p>
      <div className='h-[60vh] grid place-content-center'>
        <lord-icon src='https://cdn.lordicon.com/pgmktfgp.json' style={{ width: "200px", height: "200px" }} state='loop-roll' trigger='loop' colors='primary:#9cf4df,secondary:#848484'></lord-icon>
      </div>
    </>
  );
}
