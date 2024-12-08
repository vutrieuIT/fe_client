// import React from 'react';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../../config/Api";
import axios from "axios";
import Swal from "sweetalert2";
// import { Dropdown } from "react-bootstrap";

const Checkout = () => {
  const [carts, setCarts] = useState([]);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  // Khởi tạo state cho các trường họ và tên, số điện thoại và địa chỉ giao hàng
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState({});
  const [discountValue, setDiscountValue] = useState(0);

  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [street, setStreet] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [addressCode, setAddressCode] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfos = await sessionStorage.getItem("userInfo");

      if (userInfos) {
        const auth_user = JSON.parse(userInfos);
        setFullName(auth_user.name);
        setEmail(auth_user.email);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    // Gọi hàm để lấy carts của user khi component được render
    getCartsByUser();
    console.log(carts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependency array rỗng đảm bảo hàm chỉ được gọi một lần khi component mount

  const userInfos = sessionStorage.getItem("userInfo");
  const auth_user = JSON.parse(userInfos);

  const header = {
    headers: {
      Authorization: `Bearer ${auth_user.token}`,
    },
  };

  const getCartsByUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`, header);
      const cartsData = response.data;
      console.log("Carts:", cartsData);
      // Lưu dữ liệu carts vào state
      setCarts(cartsData);
      let totalCartPrice_temp = 0;

      // Lặp qua mảng cartsData để tính tổng tiền
      for (let i = 0; i < cartsData.length; i++) {
        // Lấy item hiện tại từ mảng cartsData
        const item = cartsData[i];
        // Tính tổng tiền của từng loại sản phẩm
        const itemTotal = item.quantity * +item.price;
        // Cộng vào tổng tiền của giỏ hàng
        totalCartPrice_temp += itemTotal;
      }
      setTotalCartPrice(Math.floor(totalCartPrice_temp));
      // Chuyển hướng đến trang thanh toán sau khi đã lấy được carts
    } catch (error) {
      console.error("Error while fetching carts:", error);
    }
  };

  // Hàm xử lý sự kiện thay đổi giá trị của trường họ và tên
  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  // Hàm xử lý sự kiện thay đổi giá trị của trường số điện thoại
  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  // Hàm xử lý sự kiện thay đổi giá trị của trường địa chỉ giao hàng
  const handleAddressChange = (e) => {
    const newStreet = e.target.value;
    setStreet(newStreet);
    const address = `${newStreet}, ${ward}, ${district}, ${province}`;
    setAddress(address);
  };
  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      // Thực hiện các thao tác cần thiết trước khi chuyển đến trang thanh toán
      // Ví dụ: Kiểm tra xem giỏ hàng có hàng hay không

      // Tạo payload chứa thông tin người dùng và đơn hàng
      const payload = {
        user_id: auth_user.id, // Lấy user_id từ context hoặc props
        full_name: fullName, // Lấy tên người dùng từ input
        phone_number: phoneNumber, // Lấy số điện thoại từ input
        address: address, // Lấy địa chỉ từ input
        addressCode: addressCode,
        discountCode: discount.code,
        // Các thuộc tính khác nếu cần
      };

      // Gửi request POST đến API để thực hiện thanh toán
      const response = await axios.post(`${API_URL}/checkout`, payload, header);

      // Kiểm tra kết quả từ server
      if (response.status === 200) {
        console.log(response.data);
        window.location.href = response.data.redirect_url;
        // await   Swal.fire({
        //     title: "Thanh toán thành công!",
        //     text: "Tiếp tục",
        //     icon: "success"
        //   });
      } else {
        console.error("Checkout failed.");
        // Xử lý lỗi nếu có
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      // Xử lý lỗi nếu có
    }
  };

  // lấy đơn vị hành chính cấp tỉnh
  useEffect(() => {
    axios
      .get(API_URL + "/ghn/province")
      .then((res) => {
        setProvinceList(res.data.data);
        // sort theo tên tỉnh thành
        setProvinceList((prev) => {
          return prev.sort((a, b) =>
            a.ProvinceName.localeCompare(b.ProvinceName, "vi")
          );
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // lấy đơn vị hành chính cấp huyện
  const handleProvinceChange = (e) => {
    axios.get(API_URL + `/ghn/district/${e.target.value}`).then((res) => {
      setDistrictList(res.data.data);
      // sort theo tên huyện
      setDistrictList((prev) => {
        return prev.sort((a, b) =>
          a.DistrictName.localeCompare(b.DistrictName, "vi")
        );
      });
    });
    const selectedName = e.target.options[e.target.selectedIndex].text;  
    setProvince(selectedName);
    addressCode[2] = e.target.value;
  };

  // lấy đơn vị hành chính cấp xã
  const handleDistrictChange = (e) => {
    axios.get(API_URL + `/ghn/ward/${e.target.value}`).then((res) => {
      setWardList(res.data.data);
      
      // sort theo tên xã
      setWardList((prev) => {
        return prev.sort((a, b) => a.WardName.localeCompare(b.WardName, "vi"));
      });
    });
    const selectedName = e.target.options[e.target.selectedIndex].text;
    setDistrict(selectedName);
    addressCode[1] = e.target.value
  };

  // set đơn vị hành chính cấp xã
  const handleWardChange = (e) => {
    const selectedName = e.target.options[e.target.selectedIndex].text;
    console.log(e.target.options[e.target.selectedIndex]);
    
    setWard(selectedName);
    addressCode[0] = e.target.value;
  };

  const onBlurDiscountCode = async () => {
    await axios
      .get(`${API_URL}/discount/${discountCode}`)
      .then((res) => {
        setDiscount(res.data);
        if (res.data.discountType === "amount") {
          setDiscountValue(res.data.discount);
          console.log(discountValue);
        } else {
          setDiscountValue((totalCartPrice * res.data.discount) / 100);
        }
      })
      .catch((err) => {
        Swal.fire({
          title: JSON.stringify(err.response.data),
          icon: "error",
        });
        setDiscountValue(0);
        setDiscount({});
      });
  };

  return (
    <section>
      <div className="container">
        {/* <!-- HERO SECTION--> */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
              <div className="col-lg-6">
                <h1 className="h2 text-uppercase mb-0">Tiến hành đặt hàng</h1>
              </div>
              <div className="col-lg-6 text-lg-end">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-lg-end mb-0 px-0 bg-light">
                    <li className="breadcrumb-item">
                      <Link className="text-dark" to="/">
                        Trang chủ
                      </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link className="text-dark" to="/gio-hang">
                        Giỏ hàng
                      </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Thanh toán
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </section>
        <section className="py-5">
          {/* <!-- BILLING ADDRESS--> */}
          <h2 className="h5 text-uppercase mb-4">Thông tin hóa đơn</h2>
          <div className="row">
            <div className="col-lg-8">
              <form action="#" onSubmit={handleCheckout}>
                <div className="row gy-3">
                  <div className="col-lg-6">
                    <label
                      className="form-label text-sm text-uppercase"
                      htmlFor="fullName"
                    >
                      Họ và Tên{" "}
                    </label>
                    <input
                      className="form-control form-control-lg"
                      autoComplete="fullName"
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your last name"
                      value={fullName}
                      onChange={handleFullNameChange}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label
                      className="form-label text-sm text-uppercase"
                      htmlFor="email"
                    >
                      Địa chỉ Email{" "}
                    </label>
                    <input
                      className="form-control form-control-lg"
                      autoComplete="email"
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. Jason@example.com"
                    />
                  </div>
                  <div className="col-lg-6">
                    <label
                      className="form-label text-sm text-uppercase"
                      htmlFor="phoneNumber"
                    >
                      Số điện thoại{" "}
                    </label>
                    <input
                      className="form-control form-control-lg"
                      autoComplete="phoneNumber"
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="e.g. +02 245354745"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label
                      className="form-label text-sm text-uppercase"
                      htmlFor="discountCode"
                    >
                      Mã giảm giá{" "}
                    </label>
                    <input
                      className="form-control form-control-lg"
                      autoComplete="discountCode"
                      type="tel"
                      id="discountCode"
                      name="discountCode"
                      placeholder=""
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      onBlur={onBlurDiscountCode}
                    />
                  </div>
                  <div className="col-lg-12">
                    <label
                      className="form-label text-sm text-uppercase"
                      htmlFor="address"
                    >
                      Địa chỉ giao hàng{" "}
                    </label>
                  </div>
                  <div className="col-lg-6">
                    <label
                      className="form-label text-sm text-uppercase"
                      htmlFor="province"
                    >
                      Tỉnh/Thành phố
                    </label>
                    <select
                      className="form-select form-select-lg"
                      id="province"
                      onChange={handleProvinceChange}
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      {provinceList.map((province, index) => (
                        <option key={index} value={province.ProvinceID}>
                          {province.ProvinceName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-6">
                    <label
                      className="form-label text-sm text-uppercase"
                      htmlFor="district"
                    >
                      Quận/Huyện
                    </label>
                    <select
                      className="form-select form-select-lg"
                      id="district"
                      onChange={handleDistrictChange}
                    >
                      <option value="">Chọn quận/huyện</option>
                      {districtList.map((district, index) => (
                        <option key={index} value={district.DistrictID}>
                          {district.DistrictName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-6">
                    <label
                      className="form-label text-sm text-uppercase"
                      htmlFor="ward"
                    >
                      Phường/Xã
                    </label>
                    <select
                      className="form-select form-select-lg"
                      id="ward"
                      onChange={handleWardChange}
                    >
                      <option value="">Chọn phường/xã</option>
                      {wardList.map((ward, index) => (
                        <option key={index} value={ward.WardCode}>
                          {ward.WardName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-6">
                    <label
                      className="form-label text-sm text-uppercase"
                      htmlFor="street"
                    >
                      Đường
                    </label>
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      id="street"
                      placeholder="Mời nhập tên đường"
                      value={street}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="col-lg-12 form-group">
                    <button className="btn btn-dark" type="submit">
                      Tiến hành thanh toán
                    </button>
                  </div>
                </div>
              </form>
            </div>
            {/* <!-- ORDER SUMMARY--> */}
            <div className="col-lg-4">
              <div className="card border-0 rounded-0 p-lg-4 bg-light">
                <div className="card-body">
                  <h5 className="text-uppercase mb-4">
                    Đơn hàng của bạn gồm <span>{carts.length} sản phẩm</span>
                  </h5>
                  <ul className="list-unstyled mb-0">
                    {/* Duyệt qua từng mục trong mảng carts */}
                    {carts &&
                      carts.length > 0 &&
                      carts.map((cartItem, index) => (
                        <li
                          key={index}
                          className="d-flex align-items-center justify-content-between"
                        >
                          {/* Hiển thị tên sản phẩm và màu sắc biến thể */}
                          <strong className="small fw-bold">
                            {cartItem.productName} - {cartItem.color} -{" "}
                            {cartItem.internalMemory}GB x {cartItem.quantity}{" "}
                          </strong>
                          {/* Hiển thị giá sản phẩm */}
                          <span className="text-muted small">
                            {Math.floor(
                              cartItem.quantity * parseFloat(cartItem.price)
                            ).toLocaleString()}{" "}
                            vnd
                          </span>
                        </li>
                      ))}
                    {/* Tạo đường gạch ngang */}
                    <li className="border-bottom my-2"></li>
                    {/* Hiển thị tổng tiền */}
                    {discountValue > 0 && (
                      <li className="d-flex align-items-center justify-content-between">
                        <strong className="text-uppercase small fw-bold">
                          Khuyến mãi
                        </strong>
                        <span>{discountValue.toLocaleString()} vnd</span>
                      </li>
                    )}
                    <li className="d-flex align-items-center justify-content-between">
                      <strong className="text-uppercase small fw-bold">
                        Tổng cộng
                      </strong>
                      <span>
                        {(totalCartPrice - discountValue).toLocaleString()} vnd
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Checkout;
