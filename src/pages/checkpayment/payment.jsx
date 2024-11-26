import { Link } from "react-router-dom";

function CheckPayment() {
  const fontSize = {
    fontSize: '56px',
  };

  const fontSizeMediaQuery = {
    '@media (min-width: 768px)': {
      fontSize: '260px',
    },
  };
  const queryParameters = new URLSearchParams(window.location.search)

  console.log(window.location.search);
  
  let vnp_ResponseCode =  queryParameters.get('vnp_ResponseCode')

  // Kiểm tra vnp_ResponseCode để xác định trạng thái thanh toán
  const paymentSuccess = vnp_ResponseCode == '00';
  return (
    <>
      <div className="h-100 w-100 text-center">
        <h3 style={{ height: 500 }}>
          <p>
            <Link className="text-decoration-underline fs-4" to={"/lazi-store/"}>
              Trở lại trang chủ
            </Link>
          </p>
          {paymentSuccess ? (
            <p className="text-success" style={{ ...fontSize, ...fontSizeMediaQuery }}>
              <div className={`fixed inset-0 flex items-center justify-center z-50 ${'pointer-events-none'}`}>
               
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
                  <h2 className="text-xl font-semibold mb-4">Payment Successful!</h2>
                  <p className="text-gray-700 mb-4">
                    Thank you for your payment. Your transaction has been completed successfully.
                  </p>
                </div>
              </div>
            </p>
          ) : (
            <p className="text-danger" style={{ ...fontSize, ...fontSizeMediaQuery }}>
              <div className={`fixed inset-0 flex items-center justify-center z-50 ${'pointer-events-none'}`}>
              
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
                  <h2 className="text-xl font-semibold mb-4">Payment Failed!</h2>
                  <p className="text-gray-700 mb-4">Payment unsuccessful. Please try again.</p>
                </div>
              </div>
            </p>
          )}
        </h3>
      </div>
    </>
  );
}

export default CheckPayment;
