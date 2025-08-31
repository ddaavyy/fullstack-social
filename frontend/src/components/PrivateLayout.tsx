import { Outlet } from 'react-router-dom';

import Header from './Header';

export default function PrivateLayout() {
  return (
    <div className='bg-[#0a1b2e] text-white w-screen h-screen'>
      <Header />
        <Outlet />
    </div>
  );
}
