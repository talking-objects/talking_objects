import GlobalPadding from "./GlobalPadding";

const DContainer = ({ children, color='white', paddingOn=false, block=false }) => {
  const getColor = {
    'white': "bg-white bg-opacity-100",
    'blue' : "bg-toa-blue bg-opacity-10",
    'red' : "bg-toa-red bg-opacity-5",
    'yellow': "bg-toa-yellow bg-opacity-5",
    'footer-black' : "bg-toa-black"
  }
  return (
    <div className={`w-screen h-fit ${getColor[color]} relative overflow-hidden`}>
      <GlobalPadding paddingOn={paddingOn} block={block}>
        {children}
      </GlobalPadding>
    </div>
  );
};

export default DContainer;
