import GlobalPadding from "./GlobalPadding";

const HContainer = ({ children, color='white', footerMode=false, block=false }) => {
  const getColor = {
    'white': "bg-white bg-opacity-100",
    'blue' : "bg-toa-blue bg-opacity-10",
    'red' : "bg-toa-red bg-opacity-5",
    'yellow': "bg-toa-yellow bg-opacity-5",
    'footer-black' : "bg-toa-black",
    'blue2': "bg-[#bfcfff]",
    'sBlack': "bg-neutral-800"
  }
  return (
    <div className={`w-screen overflow-hidden ${footerMode ? "h-fit" : "min-h-[100svh] h-full"} ${getColor[color]} relative transition-colors`}>
      <GlobalPadding block={block}>
        {children}
      </GlobalPadding>
    </div>
  );
};

export default HContainer;
