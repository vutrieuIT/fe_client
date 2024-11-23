import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import URL_PATH from "../../config/UrlPath";
import { useDispatch } from "react-redux";
import cartSlice from "../../state/cartSlice";
import axios from "axios";
import API_URL, { HOST } from "../../config/Api";
function Home() {
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [bestsellingProducts, setBestsellingProducts] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const hasLogin = sessionStorage.getItem("hasLogin");
  const getProducts = async () => {
    try {
      const response = await axios.get(API_URL.concat("/san-pham"));
      const data = await response.data;
      if (response.status === 200) {
        console.log(data);
        return setProducts(data);
      }
    } catch (error) {
      // console.log(error.response.data.errors.name[0]);

      console.log(error);
    }
  };
  const getNewProducts = async () => {
    try {
      const response = await axios.get(API_URL.concat("/san-pham-moi"));
      const data = await response.data;
      if (response.status === 200) {
        setNewProducts(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBestsellingProducts = async () => {
    try {
      const response = await axios.get(API_URL.concat("/san-pham-ban-chay"));
      const data = await response.data;
      if (response.status === 200) {
        setBestsellingProducts(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getHotProducts = async () => {
    try {
      const response = await axios.get(API_URL.concat("/san-pham-hot"));
      const data = await response.data;
      if (response.status === 200) {
        setHotProducts(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!products.length) {
      getProducts();
    }
    // if (!newProducts.length) {
    //   getNewProducts();
    // }
    // if (!bestsellingProducts.length) {
    //   getBestsellingProducts();
    // }
    // if (!hotProducts.length) {
    //   getHotProducts();
    // }
  }, [products]);

  const dispatch = useDispatch();
  // const globalstate = useSelector(state=>state.cartState);
  const { add } = cartSlice.actions;
  const product_newProducts = newProducts.map((product) => {
    if (product.variations.length === 0) return;
    return (
      <div key={product.id} className="col-xl-3 col-lg-4 col-sm-6">
        <div
          className={`product text-start bg-light mb-3 ${styles.borderProduct} ${styles.paddingImageProduct}`}
        >
          <div className="position-relative mb-3">
            {product.status == "Sale" && (
              <div className="badge text-white bg-danger">{product.status}</div>
            )}
            {product.status == "Mới" && (
              <div className="badge text-white bg-danger">{product.status}</div>
            )}
            {product.status == "Hết hàng" && (
              <div className="badge text-white bg-secondary">
                {product.status}
              </div>
            )}
            {product.status == "Bán chạy" && (
              <div className="badge text-white bg-danger">{product.status}</div>
            )}
            {product.status == "" && (
              <div className="badge">{product.status}</div>
            )}
            <Link className="d-block" to={`./cua-hang/${product.id}`}>
              <img
                className={`img-fluid ${styles.borderImageProduct}`}
                src={`${product.variations[0].image_url}`}
                alt={product.img}
              />
            </Link>
            <div className="product-overlay">
              <ul className="mb-0 list-inline">
                <li className="list-inline-item m-0 p-0">
                  <a className="btn btn-sm btn-outline-dark" href="#!">
                    <i className="far fa-heart"></i>
                  </a>
                </li>
                {!hasLogin ? (
                  <li className="list-inline-item m-0 p-0">
                    <a className="btn btn-sm btn-dark" href={"dang-nhap"}>
                      <i className="fa fa-cart-plus"></i> Thêm vào giỏ
                    </a>
                  </li>
                ) : (
                  <li className="list-inline-item m-0 p-0">
                    <button
                      className="btn btn-sm btn-dark"
                      onClick={() => {
                        dispatch(add({ ...product, quantity: 1 }));
                      }}
                    >
                      <i className="fa fa-cart-plus"></i> Thêm vào giỏ{" "}
                    </button>
                  </li>
                )}
                <li className="list-inline-item me-0">
                  <a
                    className="btn btn-sm btn-outline-dark"
                    href="#productView"
                    data-bs-toggle="modal"
                  >
                    <i className="fas fa-expand"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <h6 className="text-center">
            {" "}
            <Link
              className="reset-anchor"
              to={`/${URL_PATH}/cua-hang/${product.id}`}
            >
              {product.type}
            </Link>
          </h6>
          <h6 className="text-center">
            {" "}
            <Link
              className="reset-anchor"
              to={`/${URL_PATH}/cua-hang/${product.id}`}
            >
              {product.name}
            </Link>
          </h6>
          <p className="text-center mb-1 small text-black">
            ${product.variations[0].price}
          </p>
        </div>
      </div>
    );
  });
  const product_bestsellingProducts = bestsellingProducts.map((product) => {
    if (product.variations.length === 0) return;
    return (
      <div key={product.id} className="col-xl-3 col-lg-4 col-sm-6">
        <div
          className={`product text-start bg-light mb-3 ${styles.borderProduct} ${styles.paddingImageProduct}`}
        >
          <div className="position-relative mb-3">
            {product.status == "Sale" && (
              <div className="badge text-white bg-danger">{product.status}</div>
            )}
            {product.status == "Mới" && (
              <div className="badge text-white bg-danger">{product.status}</div>
            )}
            {product.status == "Hết hàng" && (
              <div className="badge text-white bg-secondary">
                {product.status}
              </div>
            )}
            {product.status == "Bán chạy" && (
              <div className="badge text-white bg-danger">{product.status}</div>
            )}
            {product.status == "" && (
              <div className="badge">{product.status}</div>
            )}
            <Link className="d-block" to={`./cua-hang/${product.id}`}>
              <img
                className={`img-fluid ${styles.borderImageProduct}`}
                src={`${product.variations[0].image_url}`}
                alt={product.img}
              />
            </Link>
            <div className="product-overlay">
              <ul className="mb-0 list-inline">
                <li className="list-inline-item m-0 p-0">
                  <a className="btn btn-sm btn-outline-dark" href="#!">
                    <i className="far fa-heart"></i>
                  </a>
                </li>
                {!hasLogin ? (
                  <li className="list-inline-item m-0 p-0">
                    <a className="btn btn-sm btn-dark" href={"dang-nhap"}>
                      <i className="fa fa-cart-plus"></i> Thêm vào giỏ
                    </a>
                  </li>
                ) : (
                  <li className="list-inline-item m-0 p-0">
                    <button
                      className="btn btn-sm btn-dark"
                      onClick={() => {
                        dispatch(add({ ...product, quantity: 1 }));
                      }}
                    >
                      <i className="fa fa-cart-plus"></i> Thêm vào giỏ{" "}
                    </button>
                  </li>
                )}
                <li className="list-inline-item me-0">
                  <a
                    className="btn btn-sm btn-outline-dark"
                    href="#productView"
                    data-bs-toggle="modal"
                  >
                    <i className="fas fa-expand"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <h6 className="text-center">
            {" "}
            <Link
              className="reset-anchor"
              to={`/${URL_PATH}/cua-hang/${product.id}`}
            >
              {product.type}
            </Link>
          </h6>
          <h6 className="text-center">
            {" "}
            <Link
              className="reset-anchor"
              to={`/${URL_PATH}/cua-hang/${product.id}`}
            >
              {product.name}
            </Link>
          </h6>
          <p className="text-center mb-1 small text-black">
            ${product.variations[0].price}
          </p>
        </div>
      </div>
    );
  });
  const product_hotProducts = hotProducts.map((product) => {
    if (product.variations.length === 0) return;
    return (
      <div key={product.id} className="col-xl-3 col-lg-4 col-sm-6">
        <div
          className={`product text-start bg-light mb-3 ${styles.borderProduct} ${styles.paddingImageProduct}`}
        >
          <div className="position-relative mb-3">
            {product.status == "Sale" && (
              <div className="badge text-white bg-danger">{product.status}</div>
            )}
            {product.status == "Mới" && (
              <div className="badge text-white bg-danger">{product.status}</div>
            )}
            {product.status == "Hết hàng" && (
              <div className="badge text-white bg-secondary">
                {product.status}
              </div>
            )}
            {product.status == "Bán chạy" && (
              <div className="badge text-white bg-danger">{product.status}</div>
            )}
            {product.status == "" && (
              <div className="badge">{product.status}</div>
            )}
            <Link className="d-block" to={`./cua-hang/${product.id}`}>
              <img
                className={`img-fluid ${styles.borderImageProduct}`}
                src={`${product.variations[0].image_url}`}
                alt={product.img}
              />
            </Link>
            <div className="product-overlay">
              <ul className="mb-0 list-inline">
                <li className="list-inline-item m-0 p-0">
                  <a className="btn btn-sm btn-outline-dark" href="#!">
                    <i className="far fa-heart"></i>
                  </a>
                </li>
                {!hasLogin ? (
                  <li className="list-inline-item m-0 p-0">
                    <a className="btn btn-sm btn-dark" href={"dang-nhap"}>
                      <i className="fa fa-cart-plus"></i> Thêm vào giỏ
                    </a>
                  </li>
                ) : (
                  <li className="list-inline-item m-0 p-0">
                    <button
                      className="btn btn-sm btn-dark"
                      onClick={() => {
                        dispatch(add({ ...product, quantity: 1 }));
                      }}
                    >
                      <i className="fa fa-cart-plus"></i> Thêm vào giỏ{" "}
                    </button>
                  </li>
                )}
                <li className="list-inline-item me-0">
                  <a
                    className="btn btn-sm btn-outline-dark"
                    href="#productView"
                    data-bs-toggle="modal"
                  >
                    <i className="fas fa-expand"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <h6 className="text-center">
            {" "}
            <Link
              className="reset-anchor"
              to={`/${URL_PATH}/cua-hang/${product.id}`}
            >
              {product.type}
            </Link>
          </h6>
          <h6 className="text-center">
            {" "}
            <Link
              className="reset-anchor"
              to={`/${URL_PATH}/cua-hang/${product.id}`}
            >
              {product.name}
            </Link>
          </h6>
          <p className="text-center mb-1 small text-black">
            ${product.variations[0].price}
          </p>
        </div>
      </div>
    );
  });
  const productView = products.map((product) => {
    if (product.specifications.length === 0) return;
    return (
      <div key={product.id} className="col-xl-3 col-lg-4 col-sm-6">
        <div
          className={`product text-start bg-light mb-3 ${styles.borderProduct} ${styles.paddingImageProduct}`}
        >
          <div className="position-relative mb-3">
            <div className="badge">{product.status} logic</div>
            <Link className="d-block" to={`./cua-hang/${product.id}`}>
              <img
                className={`img-fluid ${styles.borderImageProduct}`}
                src={`${HOST.concat(product.variants[0].images[0])}`}
                alt={product.name}
              />
            </Link>
            <div className="product-overlay">
              <ul className="mb-0 list-inline">
                <li className="list-inline-item m-0 p-0">
                  <a className="btn btn-sm btn-outline-dark" href="#!">
                    <i className="far fa-heart"></i>
                  </a>
                </li>
                {!hasLogin ? (
                  <li className="list-inline-item m-0 p-0">
                    <a className="btn btn-sm btn-dark" href={"dang-nhap.html"}>
                      <i className="fa fa-cart-plus"></i> Thêm vào giỏ
                    </a>
                  </li>
                ) : (
                  <li className="list-inline-item m-0 p-0">
                    <button
                      className="btn btn-sm btn-dark"
                      onClick={() => {
                        dispatch(add({ ...product, quantity: 1 }));
                      }}
                    >
                      <i className="fa fa-cart-plus"></i> Thêm vào giỏ{" "}
                    </button>
                  </li>
                )}
                <li className="list-inline-item me-0">
                  <a
                    className="btn btn-sm btn-outline-dark"
                    href="#productView"
                    data-bs-toggle="modal"
                  >
                    <i className="fas fa-expand"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <h6 className="text-center">
            {" "}
            <Link
              className="reset-anchor"
              to={`/${URL_PATH}/cua-hang/${product.id}`}
            >
              {product.type}
            </Link>
          </h6>
          <h6 className="text-center">
            {" "}
            <Link
              className="reset-anchor"
              to={`/${URL_PATH}/cua-hang/${product.id}`}
            >
              {product.name}
            </Link>
          </h6>
          <p className="text-center mb-1 small text-black">
            ${product.specifications[0].price}
          </p>
        </div>
      </div>
    );
  });
  return (
    <section>
      {/*<!--  Modal -->*/}
      <div className="modal fade" id="productView" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content overflow-hidden border-0">
            <button
              className="btn-close p-4 position-absolute top-0 end-0 z-index-20 shadow-0"
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            <div className="modal-body p-0">
              <div className="row align-items-stretch">
                <div className="col-lg-6 p-lg-0">
                  <a
                    className={`glightbox product-view d-block h-100 bg-cover bg-center ${styles.linkStyle}`}
                    href="img/product-5.jpg"
                    data-gallery="gallery1"
                    data-glightbox="Red digital smartwatch"
                  ></a>
                  <a
                    className="glightbox d-none"
                    href="img/product-5-alt-1.jpg"
                    data-gallery="gallery1"
                    data-glightbox="Red digital smartwatch"
                  ></a>
                  <a
                    className="glightbox d-none"
                    href="img/product-5-alt-2.jpg"
                    data-gallery="gallery1"
                    data-glightbox="Red digital smartwatch"
                  ></a>
                </div>
                <div className="col-lg-6">
                  <div className="p-4 my-md-4">
                    <ul className="list-inline mb-2">
                      <li className="list-inline-item m-0">
                        <i className="fas fa-star small text-warning"></i>
                      </li>
                      <li className="list-inline-item m-0 1">
                        <i className="fas fa-star small text-warning"></i>
                      </li>
                      <li className="list-inline-item m-0 2">
                        <i className="fas fa-star small text-warning"></i>
                      </li>
                      <li className="list-inline-item m-0 3">
                        <i className="fas fa-star small text-warning"></i>
                      </li>
                      <li className="list-inline-item m-0 4">
                        <i className="fas fa-star small text-warning"></i>
                      </li>
                    </ul>
                    <h2 className="h4">Red digital smartwatch</h2>
                    <p className="text-muted">$250</p>
                    <p className="text-sm mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      In ut ullamcorper leo, eget euismod orci. Cum sociis
                      natoque penatibus et magnis dis parturient montes nascetur
                      ridiculus mus. Vestibulum ultricies aliquam convallis.
                    </p>
                    <div className="row align-items-stretch mb-4 gx-0">
                      <div className="col-sm-7">
                        <div className="border d-flex align-items-center justify-content-between py-1 px-3">
                          <span className="small text-uppercase text-gray mr-4 no-select">
                            Quantity
                          </span>
                          <div className="quantity">
                            <button className="dec-btn p-0">
                              <i className="fas fa-caret-left"></i>
                            </button>
                            <input
                              className="form-control border-0 shadow-0 p-0"
                              type="text"
                              onChange={() => {}}
                              value="1"
                            />
                            <button className="inc-btn p-0">
                              <i className="fas fa-caret-right"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <a
                          className="btn btn-dark btn-sm w-100 h-100 d-flex align-items-center justify-content-center px-0"
                          href="cart.html"
                        >
                          Add to cart
                        </a>
                      </div>
                    </div>
                    <a
                      className="btn btn-link text-dark text-decoration-none p-0"
                      href="#!"
                    >
                      <i className="far fa-heart me-2"></i>Add to wish list
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- HERO SECTION-->*/}
      <div className="container">
        <section
          className={`hero pb-3 bg-cover bg-center d-flex align-items-center ${styles.bannerStyle}`}
        >
          <div className="container py-5">
            <div className="row px-4 px-lg-5">
              <div className="col-lg-6">
                <p className="text-muted small text-uppercase mb-2">
                  New Inspiration 2020
                </p>
                <h1 className="h2 text-uppercase mb-3">
                  20% off on new season
                </h1>
                <a className="btn btn-dark rounded-3" href="shop.html">
                  Xem ngay những sản phẩm mới
                </a>
              </div>
            </div>
          </div>
        </section>
        {/*<!-- NEW PRODUCTS-->*/}
        <section className="py-5">
          <header>
            <p className="small text-muted small text-uppercase mb-1">
              Made the hard way
            </p>
            <h2 className="h5 text-uppercase mb-4">Top sản phẩm mới</h2>
          </header>
          <div className="row">
            {/*<!-- PRODUCT-->*/}
            {product_newProducts}
          </div>
        </section>
        {/*<!-- HOT PRODUCTS-->*/}
        <section className="py-5">
          <header>
            <p className="small text-muted small text-uppercase mb-1">
              Made the hard way
            </p>
            <h2 className="h5 text-uppercase mb-4">Top sản phẩm nổi bật</h2>
          </header>
          <div className="row">
            {/*<!-- PRODUCT-->*/}
            {product_hotProducts}
          </div>
        </section>
        {/*<!-- BEST SALE PRODUCTS-->*/}
        <section className="py-5">
          <header>
            <p className="small text-muted small text-uppercase mb-1">
              Made the hard way
            </p>
            <h2 className="h5 text-uppercase mb-4">Top sản phẩm bán chạy</h2>
          </header>
          <div className="row">
            {/*<!-- PRODUCT-->*/}
            {product_bestsellingProducts}
          </div>
        </section>
        {/* PRODUCT */}
        <section className="py-5">
          <header>
            <p className="small text-muted small text-uppercase mb-1">
              Made the hard way
            </p>
            <h2 className="h5 text-uppercase mb-4">Danh sách sản phẩm</h2>
          </header>
          <div className="row">
            {/*<!-- PRODUCT-->*/}
            {productView}
          </div>
        </section>
        {/*<!-- SERVICES-->*/}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row text-center gy-3">
              <div className="col-lg-4">
                <div className="d-inline-block">
                  <div className="d-flex align-items-end">
                    <svg className="svg-icon svg-icon-big svg-icon-light">
                      <use xlinkHref="#delivery-time-1"> </use>
                    </svg>
                    <div className="text-start ms-3">
                      <h6 className="text-uppercase mb-1">Free shipping</h6>
                      <p className="text-sm mb-0 text-muted">
                        Free shipping worldwide
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="d-inline-block">
                  <div className="d-flex align-items-end">
                    <svg className="svg-icon svg-icon-big svg-icon-light">
                      <use xlinkHref="#helpline-24h-1"></use>
                    </svg>
                    <div className="text-start ms-3">
                      <h6 className="text-uppercase mb-1">24 x 7 service</h6>
                      <p className="text-sm mb-0 text-muted">
                        Free shipping worldwide
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="d-inline-block">
                  <div className="d-flex align-items-end">
                    <svg className="svg-icon svg-icon-big svg-icon-light">
                      <use xlinkHref="#label-tag-1"> </use>
                    </svg>
                    <div className="text-start ms-3">
                      <h6 className="text-uppercase mb-1">Festivaloffers</h6>
                      <p className="text-sm mb-0 text-muted">
                        Free shipping worldwide
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*<!-- NEWSLETTER-->*/}
        <section className="py-5">
          <div className="container p-0">
            <div className="row gy-3">
              <div className="col-lg-6">
                <h5 className="text-uppercase">{`Let's be friends !`}</h5>
                <p className="text-sm text-muted mb-0">{`Nisi nisi tempor consequat laboris nisi.`}</p>
              </div>
              <div className="col-lg-6">
                <form action="#">
                  <div className="input-group">
                    <input
                      onChange={() => {}}
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Enter your email address"
                      aria-describedby="button-addon2"
                    />
                    <button
                      className="btn btn-dark"
                      id="button-addon2"
                      type="submit"
                    >{`Subscribe`}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Home;
