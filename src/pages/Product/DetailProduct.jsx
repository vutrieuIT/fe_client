import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
// import styles from "./styles.module.css";
// import { useDispatch } from "react-redux";
// import cartSlice from "../../state/cartSlice";
import API_URL, { HOST } from "../../config/Api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CommentComponent from "../../components/CommentComponent";

const DetailProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  //user data
  const userInfos = sessionStorage.getItem("userInfo");

  const auth_user = JSON.parse(userInfos);
  const [productDetail, setProductDetail] = useState([]);
  // detail
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  // add to cart
  const [quantity, setQuantity] = useState(0);
  // recommend product
  const [recommendProducts, setRecommendProducts] = useState([]);
  // selected specification
  const [selectedSpecification, setSelectedSpecification] = useState({});
  const [listSpecificationColor, setListSpecificationColor] = useState([]);
  // ảnh được chọn
  const [selectedImage, setSelectedImage] = useState("");

  const handleColorClick = (colorType, variant) => {
    setSelectedColor(colorType);
    variantImageRender(colorType)?.[0] &&
      setSelectedImage(variantImageRender(colorType)?.[0]);
    setSelectedProduct(variant);
    setQuantity(1);
  };

  const handleSpecificationClick = (specification) => {
    setSelectedSpecification(specification);
    setListSpecificationColor(specification.colorVariant);
    setSelectedColor(specification.colorVariant?.[0]?.color);
    variantImageRender(specification.colorVariant?.[0]?.color)?.[0] &&
      setSelectedImage(
        variantImageRender(specification.colorVariant?.[0]?.color)?.[0]
      );
  };

  const getDetail = async (id) => {
    try {
      await axios.get(`${API_URL}/san-pham/${id}`).then((response) => {
        const data = response.data;
        setProductDetail(data);
        setSelectedSpecification(data.specifications?.[0]);
        setListSpecificationColor(data.specifications?.[0]?.colorVariant);
        setSelectedColor(data.specifications?.[0]?.colorVariant?.[0]?.color);
        setSelectedImage(data.variants?.[0]?.images[0]);
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const addToCart = async () => {
    try {
      if (!selectedProduct) {
        // Nếu không có sản phẩm nào được chọn
        console.log("Please select a product variant.");
        return;
      }
      const price =
        selectedProduct.price_sale !== "0.00"
          ? selectedProduct.price_sale
          : selectedProduct.price;
      // Tạo payload để gửi lên server
      const payload = {
        quantity: parseInt(quantity),
        product_id: selectedProduct.product_id,
        variant_id: selectedProduct.id,
        price: parseFloat(price), // Chuyển đổi sang kiểu số thực
        user_id: auth_user.id, // Sử dụng auth_user từ context hoặc props
      };
      console.log(payload);
      // Gửi request POST lên server
      const response = await axios.post(`${API_URL}/add-to-cart`, payload);

      // Kiểm tra kết quả từ server
      if (response.status === 200) {
        console.log("Product added to cart successfully!");
        // Reset quantity sau khi thêm vào giỏ hàng
        setQuantity(0);
        await Swal.fire({
          title: "Good job!",
          text: "You clicked the button!",
          icon: "success",
        });
        navigate("/lazi-store/gio-hang.html");
      } else {
        console.log("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const getRecommnedProduct = async () => {
    await axios
      .get(
        `${API_URL}/recommend?userId=${
          userInfos == null ? "" : userInfos[0].id
        }&productId=${id}`
      )
      .then((response) => {
        setRecommendProducts(response.data);
      })
      .catch((error) =>
        console.error("Error fetching recommended products:", error)
      );
  };

  // api xóa comment
  const deleteComment = async (id) => {
    try {
      const userInfos = JSON.parse(sessionStorage.getItem("userInfo"));
      await axios
        .delete(`${API_URL}/san-pham/comment/${id}`, {
          headers: {
            Authorization: `Bearer ${userInfos.token}`,
          },
        })
        .then((response) => {
          console.log(response);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // api save comment
  const saveComment = async (data) => {
    try {
      const payload = { ...data, productId: id };
      const userInfos = JSON.parse(sessionStorage.getItem("userInfo"));
      const header = {
        headers: {
          Authorization: `Bearer ${userInfos.token}`,
        },
      };

      await axios
        .post(`${API_URL}/san-pham/comment`, payload, header)
        .then((response) => {
          console.log(response);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!productDetail.length) {
      getDetail(id);
    }
    getRecommnedProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // render giao diện
  const variantImageRender = (color) => {
    const variants = productDetail?.variants;
    if (variants) {
      const variant = variants.find((v) => v.color === color);
      if (variant) {
        return variant.images;
      }
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-7">
            {/* <!-- PRODUCT SLIDER--> */}
            <div className="row m-sm-0">
              <div className="col-sm-2 p-sm-0 order-2 order-sm-1 mt-2 mt-sm-0 px-xl-2">
                <div className="swiper product-slider-thumbs">
                  <div className="swiper-wrapper d-inline">
                    {variantImageRender(selectedColor)?.map((image, index) => (
                      <div
                        key={index}
                        className="swiper-slide h-auto swiper-thumb-item mb-3"
                        onClick={() => setSelectedImage(image)}
                      >
                        <img
                          className="w-100"
                          src={HOST + image}
                          alt={`Product variation ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-sm-10 order-1 order-sm-2">
                <div className="swiper product-slider w-100 h-100">
                  <div className="swiper-wrapper">
                    {variantImageRender(selectedColor)?.map((image, index) =>
                      selectedImage === image ? (
                        <div key={index} className="swiper-slide h-auto">
                          <a
                            className="glightbox product-view"
                            href={HOST + image}
                            data-gallery="gallery2"
                            data-glightbox={`Product item ${index + 1}`}
                          >
                            <img
                              className="img-fluid object-fit-contain w-100"
                              style={{ maxHeight: "500px" }}
                              src={HOST + image}
                              alt={`Product variation ${index + 1}`}
                            />
                          </a>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            {/* <!-- PRODUCT DETAILS--> */}
            {productDetail && (
              <div className="product-detail">
                <h1 className="text-2xl font-bold mb-4">
                  {productDetail.name}
                </h1>
                <div className="variation-buttons mb-4">
                  <h4>Bộ nhớ</h4>
                  {productDetail.specifications?.map((specification, index) => (
                    <button
                      key={index}
                      className={`btn btn-outline-dark mx-1 ${
                        selectedSpecification.internalMemory ===
                        specification.internalMemory
                          ? "active"
                          : ""
                      }`}
                      onClick={() => handleSpecificationClick(specification)}
                    >
                      {specification.internalMemory} GB
                    </button>
                  ))}
                  <h4>Màu sắc</h4>
                  {listSpecificationColor?.map((variant, index) => (
                    <button
                      key={index}
                      className={`btn btn-outline-dark mx-1 ${
                        selectedColor === variant.color ? "active" : ""
                      }`}
                      onClick={() => handleColorClick(variant.color, variant)}
                    >
                      {variant.color}
                    </button>
                  ))}
                </div>
                <h3 className="text-lg font-semibold mb-2">Giá:</h3>
                <div className="price">
                  <span>{selectedSpecification?.price} vnd</span>
                </div>
                {/* Add to Cart button and Quantity input */}
                <div className="flex items-center mt-4">
                  <input
                    type="number"
                    className="w-50 mr-4 border border-gray-300 rounded-md p-1 focus:outline-none focus:border-blue-500"
                    value={quantity}
                    min={1}
                    onChange={(e) => setQuantity(e.target.value)}
                    max={selectedProduct ? selectedProduct.quantity : 0} // Set max quantity based on selected product
                  />
                  <button
                    className="bg-blue-500 text-black px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
                    onClick={addToCart}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* <!-- DETAILS TABS--> */}
        <div className="row mb-5">
          <div className="col-lg-7 col-sm-12">
            <ul className="nav nav-tabs border-0" id="myTab" role="tablist">
              <li className="nav-item">
                <a
                  className="nav-link text-uppercase active"
                  id="description-tab"
                  data-bs-toggle="tab"
                  href="#description"
                  role="tab"
                  aria-controls="description"
                  aria-selected="true"
                >
                  Thông tin
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link text-uppercase"
                  id="reviews-tab"
                  data-bs-toggle="tab"
                  href="#reviews"
                  role="tab"
                  aria-controls="reviews"
                  aria-selected="false"
                >
                  Đánh giá
                </a>
              </li>
            </ul>
            <div className="tab-content mb-5" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="description"
                role="tabpanel"
                aria-labelledby="description-tab"
              >
                <div className="p-4 p-lg-12 bg-white">
                  <h6 className="fs-4 mb-4">Thông tin về sản phẩm này</h6>
                  <p className="mb-4">
                    <strong>Mô tả:</strong> {productDetail.description}
                  </p>
                  <h3 className="text-lg font-semibold mb-2">
                    Thông số kỹ thuật:
                  </h3>
                  <ul className="list-unstyled mb-4">
                    <li>
                      <strong>Thương hiệu:</strong> {productDetail.brandName}
                    </li>
                    <li>
                      <strong>RAM:</strong> {productDetail.ram} GB
                    </li>
                    <li>
                      <strong>Hệ điều hành:</strong>{" "}
                      {productDetail.operatingSystem}
                    </li>
                    <li>
                      <strong>Camera sau:</strong> {productDetail.mainCamera} MP
                    </li>
                    <li>
                      <strong>Camera trước:</strong>{" "}
                      {productDetail.selfieCamera} MP
                    </li>
                    <li>
                      <strong>Dung lượng pin:</strong>{" "}
                      {productDetail.batterySize} mAh
                    </li>
                    <li>
                      <strong>Kích thước màn hình:</strong>{" "}
                      {productDetail.screenSize} inches
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="reviews"
                role="tabpanel"
                aria-labelledby="reviews-tab"
              >
                <div className="p-4 p-lg-5 bg-white">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="d-flex">
                        <CommentComponent
                          style={{ width: "100%" }}
                          RatingDto={{
                            username: "Jason Doe",
                            comment:
                              "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            rating: 5,
                            id: "100000000000000000000000",
                          }}
                          onDeleteClick={deleteComment}
                          onSaveClick={saveComment}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5 col-sm-12">
            <h3>Tin tức liên quan đến sản phẩm</h3>
          </div>
        </div>
        {/* <!-- RELATED PRODUCTS--> */}

        <h2>SẢN PHẨM GỢI Ý</h2>
        <div className="row">
          {recommendProducts
            .filter((p) => p.specifications.length != 0)
            .slice(0, 3)
            .map((product, index) => {
              return (
                <div
                  className="col-lg-3 col-sm-6"
                  style={{ minHeight: "50px" }}
                  key={index}
                >
                  <div className="product text-center skel-loader">
                    <div className="d-block mb-3 position-relative">
                      <Link
                        className="d-block"
                        to={`/lazi-store/cua-hang/${product.id}`}
                      >
                        <img
                          className="img-fluid w-100"
                          src={HOST + product.variants?.[0]?.images[0]}
                          alt="..."
                        />
                      </Link>
                      <div className="product-overlay">
                        <ul className="mb-0 list-inline">
                          <li className="list-inline-item m-0 p-0">
                            <a className="btn btn-sm btn-dark" href="#!">
                              Thêm vào giỏ hàng
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <h6>
                      {" "}
                      <a className="reset-anchor" href="detail.html">
                        {product.name}
                      </a>
                    </h6>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default DetailProduct;
