import React from 'react'

function ViewTicketFooter() {
  return (
        <div className="p-4 px-4 md:p-8 mb-6 flex justify-end text-white ">
        <button className="p-3 mr-3 bg-slate-500 rounded">
            Search another       
        </button>
        <button className="p-3 mr-3 bg-blue-500 rounded">
            Print
        </button>
      </div>
  )
}

export default ViewTicketFooter