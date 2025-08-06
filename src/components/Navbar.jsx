import React from 'react';

const Navbar = () => {
  return (
    <div className="w-full flex justify-between items-center shadow-xl px-12 py-3 bg-white">
      {/* Logo Styled Like Thumbnail */}
      <div className="flex items-center gap-1">
        <div className="w-8  h-8 rounded-full overflow-hidden shadow-md">
          <img src="https://deabethqbhuwfoyvgubr.supabase.co/storage/v1/object/sign/images/21846830_6537937.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82MzViYzM4Ni1mYjJlLTQ5NjEtOWU0NC0yMGIyY2JlM2JlZTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvMjE4NDY4MzBfNjUzNzkzNy5qcGciLCJpYXQiOjE3NTQzNjM3OTcsImV4cCI6MTgxNzQzNTc5N30.TdNbSnd5z6CfUlqo66rcFX7GvUiuWofNNRD79BIg-r0" alt="" />
        </div>
        <p className="text-xl font-bold text-zinc-800">MyTask</p>
      </div>

      <div
        className="w-10 h-10 rounded-full overflow-hidden cursor-pointer ring-2 ring-zinc-300 hover:ring-blue-400 transition-all duration-300"
        title="Your Profile"
      >
        <img
          className="w-full h-full object-cover"
          src="https://deabethqbhuwfoyvgubr.supabase.co/storage/v1/object/sign/images/Screenshot%202025-08-04%20220828.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82MzViYzM4Ni1mYjJlLTQ5NjEtOWU0NC0yMGIyY2JlM2JlZTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvU2NyZWVuc2hvdCAyMDI1LTA4LTA0IDIyMDgyOC5wbmciLCJpYXQiOjE3NTQzNjMwNjcsImV4cCI6MTg0ODk3MTA2N30.QFFmiGfpfxgoXEiGRF_Okm2B4gsRcOEfh04sijDUcGY"
          alt="Profile"
        />
      </div>
    </div>
  );
};

export default Navbar;
