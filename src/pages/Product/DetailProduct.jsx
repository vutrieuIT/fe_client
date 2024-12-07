import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
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
  const [quantity, setQuantity] = useState(1);
  // recommend product
  const [recommendProducts, setRecommendProducts] = useState([]);
  // selected specification
  const [selectedSpecification, setSelectedSpecification] = useState({});
  const [listSpecificationColor, setListSpecificationColor] = useState([]);
  // ảnh được chọn
  const [selectedImage, setSelectedImage] = useState("");
  // comment
  const [comments, setComments] = useState([]);

  const handleColorClick = (colorType, variant) => {
    setSelectedColor(colorType);
    variantImageRender(colorType)?.[0] &&
      setSelectedImage(variantImageRender(colorType)?.[0]);
    setSelectedProduct({
      productId: productDetail.id,
      productName: productDetail.name,
      color: colorType,
      quantity: quantity,
      internalMemory: variant.internalMemory,
      price: variant.price,
    });
    console.log("selectedProduct", selectedProduct);
    
  };

  const handleSpecificationClick = (specification) => {
    setSelectedSpecification(specification);
    setListSpecificationColor(specification.colorVariant);
    setSelectedColor(specification.colorVariant?.[0]?.color);
    variantImageRender(specification.colorVariant?.[0]?.color)?.[0] &&
      setSelectedImage(
        variantImageRender(specification.colorVariant?.[0]?.color)?.[0]
      );

    setSelectedProduct({
      productId: productDetail.id,
      productName: productDetail.name,
      color: specification.colorVariant?.[0]?.color,
      quantity: quantity,
      internalMemory: specification.internalMemory,
      price: specification.price,
    });
    console.log("selectedProduct", selectedProduct);

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
        setSelectedProduct({
          productId: data.id,
          productName: data.name,
          color: data.specifications?.[0]?.colorVariant?.[0]?.color,
          quantity: quantity,
          internalMemory: data.specifications?.[0]?.internalMemory,
          price: data.specifications?.[0]?.price,
        });
    console.log("selectedProduct", selectedProduct);

      });
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const addToCart = async () => {
    try {
      if (auth_user == null) {
        // Nếu chưa đăng nhập
        Swal.fire({
          title: "Thông báo",
          text: "Vui lòng đăng nhập",
        icon: "warning",
        });
        navigate("/lazi-store/dang-nhap");
      }
      if (!selectedProduct) {
        // Nếu không có sản phẩm nào được chọn
        console.log("Please select a product variant.");
        return;
      }
      // Tạo payload để gửi lên server
      const payload = selectedProduct;
      // header token
      const header = {
        headers: {
          Authorization: `Bearer ${auth_user?.token}`,
        },
      };
      // Gửi request POST lên server
      const response = await axios.post(`${API_URL}/add-to-cart`, payload, header);

      // Kiểm tra kết quả từ server
      if (response.status === 200) {
        console.log("Product added to cart successfully!");
        // Reset quantity sau khi thêm vào giỏ hàng
        setQuantity(1);
        await Swal.fire({
          title: "Thông báo",
          text: "Thêm vào giỏ hàng thành công!",
          icon: "success",
        });
        navigate("/lazi-store/gio-hang");
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

  // thêm comment
  const addComment = () => {
    const ratingDto = {
      id: null,
      productId: id,
      userId: auth_user.id,
      rating: 5,
      comment: "",
      username: auth_user.name,
      isEditting: true,
    };
    setComments([ratingDto, ...comments]);
  };

  const cancleComment = () => {
    const newComments = comments.filter((c) => c.id !== null);
    setComments(newComments);
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
        .then(() => {
          getComments();
        });
    } catch (error) {
      console.log(error);
    }
  };

  // api save comment
  const saveComment = async (data) => {
    try {
      const payload = {
        ...data,
        productId: id,
        userId: auth_user.id,
        username: auth_user.name,
      };
      const userInfos = JSON.parse(sessionStorage.getItem("userInfo"));
      const header = {
        headers: {
          Authorization: `Bearer ${userInfos.token}`,
        },
      };

      await axios
        .post(`${API_URL}/san-pham/comment`, payload, header)
        .then(() => {
          getComments();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getComments = async () => {
    try {
      await axios.get(`${API_URL}/san-pham/comment/${id}`).then((response) => {
        setComments(response.data);
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
    getComments();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={addComment}
                    >
                      Thêm đánh giá
                    </Button>
                    <div className="col-lg-12">
                      {comments.map((comment, index) => (
                        <div key={index} className="d-flex">
                          <CommentComponent
                            style={{ width: "100%" }}
                            RatingDto={comment}
                            onDeleteClick={deleteComment}
                            onSaveClick={saveComment}
                            onCancleClick={cancleComment}
                          />
                        </div>
                      ))}
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
            .slice(0, 4)
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
