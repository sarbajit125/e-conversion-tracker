import React from 'react'

function CustomOverlay(props: CustomOverlayProps) {
    if (!props.isVisible) return null;
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* You can add content or other components within the overlay if needed */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <p>Loading</p>
      </div>
    </div>
  )
}

export default CustomOverlay

export interface CustomOverlayProps {
    isVisible: boolean
}