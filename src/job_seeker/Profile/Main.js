import React from 'react';
import ProfileCard from './ProfileCard';
import InfoSection from './InfoSection';
import FileUploadComponent from './FileUploadComponent';
import Advertisement from './Advertiesment';

function Main() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 z-0 ">
      <aside className="sticy top-2 right-0 w-full lg:w-1/3   p-4 bg-white shadow-md overflow-y-auto " style={{height:"40em"}}>
  <ProfileCard />
  <FileUploadComponent />
  <Advertisement />
</aside>

      <main className="w-full lg:w-2/3 p-0 h-screen">
        <InfoSection />
      </main>
    </div>
  );
}

export default Main;
