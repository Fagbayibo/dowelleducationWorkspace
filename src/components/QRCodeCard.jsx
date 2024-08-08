import { LinkIcon } from "@heroicons/react/20/solid";

// eslint-disable-next-line react/prop-types
const QRCodeCard = ({ imageSrc, instanceName, scaleLink, qrCodeLink, reportLink, onClick, type }) => {
  return (
    <div onClick={onClick} className="max-w-sm bg-lightblue border border-deepblue shadow-xl rounded-lg overflow-hidden px-2 py-3 cursor-pointer">
      <div className="flex items-center flex-col ">
        <img className="w-36 h-36 my-4" src={imageSrc} alt="QR Code" />
        <div className="border-t border-[1.3px] w-full border-gray-600 mb-2"></div>
        <div className="flex flex-col gap-3">
          <p className="font-bold text-[14px] flex gap-3 text-left">
            Name: <span className="font-normal">{instanceName}</span>
          </p>
          {type === "report" ? (
            null
          ): (

            <p className="font-bold text-[14px] flex gap-3">
            Scale link: 
            <span
              onClick={() => navigator.clipboard.writeText(scaleLink)}
              className="flex text-sm font-normal text-deepblue cursor-pointer"
            >
              <LinkIcon className="w-3" />
              copy link
            </span>
          </p>
          )}
          <p className="font-bold text-[14px] flex gap-3">
            QR Code link: 
            <span
              onClick={() => navigator.clipboard.writeText(qrCodeLink)}
              className="flex text-sm font-normal text-deepblue cursor-pointer"
            >
              <LinkIcon className="w-3" />
              copy link
            </span>
          </p>
          {type === 'scale' ? (
            null
          ): (
            <p className="font-bold text-[14px] flex gap-3">
            Report link: 
            <span
              onClick={() => navigator.clipboard.writeText(reportLink)}
              className="flex text-sm font-normal text-deepblue cursor-pointer"
            >
              <LinkIcon className="w-3" />
              copy link
            </span>
          </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeCard;
