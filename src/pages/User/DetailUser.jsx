import "./DetailUser.css";

const DetailUser = () => {
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"))[0];

  return (
    <div className="d-flex flex-wrap justify-content-center">
      <h1 className="d-flex w-100 justify-content-center">Thông tin cá nhân</h1>

        <div className="d-flex justify-content-center  w-100" >
          <div className="w-100" style={{
            maxWidth: "500px",
            padding: "20px",
          }}>
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                className="form-control"
                value={userInfo.name}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="text"
                className="form-control"
                value={userInfo.email}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                className="form-control"
                value={userInfo.phone}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                className="form-control"
                value={userInfo.address}
                readOnly
              />
            </div>
          </div>
        </div>

    </div>
  );
};

export default DetailUser;
