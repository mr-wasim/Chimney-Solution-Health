import React from "react";
import { FaCertificate } from "react-icons/fa";
import { AiOutlineQrcode } from "react-icons/ai";

const WarrantyCard = ({ customer, address, phone, start, end, date }) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border overflow-hidden text-sm sm:text-base">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-4 flex justify-between items-center">
        <h2 className="text-white font-bold text-lg">CHIMNEY SOLUTIONS</h2>
        <div className="bg-white text-red-600 text-xs font-bold px-3 py-1 rounded-full shadow">
          1 MONTH WARRANTY
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-3">
        <h3 className="text-xl font-semibold text-blue-700">Warranty Certificate</h3>
        <p className="text-gray-600 text-sm">Serial: — &nbsp;•&nbsp; Model: —</p>

        <div className="grid grid-cols-3 gap-y-2 text-gray-800 mt-3">
          <p className="font-medium">Customer Name:</p>
          <p className="col-span-2">{customer}</p>

          <p className="font-medium">Address:</p>
          <p className="col-span-2">{address}</p>

          <p className="font-medium">Phone No.:</p>
          <p className="col-span-2">{phone}</p>

          <p className="font-medium">Warranty Start:</p>
          <p className="col-span-2">{start}</p>

          <p className="font-medium">Warranty End:</p>
          <p className="col-span-2">{end}</p>
        </div>

        {/* QR + Sign */}
        <div className="flex justify-between items-center mt-6">
          <div>
            <p className="text-gray-600 text-sm">Authorized Sign:</p>
            <div className="border-t border-gray-400 w-32 mt-6"></div>
          </div>
          <div className="text-center">
            <AiOutlineQrcode className="text-4xl text-gray-700" />
            <p className="text-xs text-gray-500 mt-1">Scan to Register</p>
          </div>
        </div>

        <p className="text-gray-500 text-xs mt-3">Date: {date}</p>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 px-6 py-3 text-xs text-gray-500 text-center">
        This warranty is valid for 1 month only. After that, standard service terms apply. 
        Terms & conditions apply.
      </div>
    </div>
  );
};

export default WarrantyCard;
