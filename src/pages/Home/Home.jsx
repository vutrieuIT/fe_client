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
    if (!newProducts.length) {
      getNewProducts();
    }
    if (!bestsellingProducts.length) {
      getBestsellingProducts();
    }
    if (!hotProducts.length) {
      getHotProducts();
    }
    // eslint-disable-next-line
  }, []);

  const dispatch = useDispatch();
  // const globalstate = useSelector(state=>state.cartState);
  const { add } = cartSlice.actions;
  const product_newProducts = newProducts.map((product) => {
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
            {product.specifications[0].price.toLocaleString()} VNĐ
          </p>
        </div>
      </div>
    );
  });
  const product_bestsellingProducts = bestsellingProducts.map((product) => {
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
            {product.specifications[0].price.toLocaleString()} VNĐ
          </p>
        </div>
      </div>
    );
  });
  const product_hotProducts = hotProducts.map((product) => {
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
            {product.specifications[0].price.toLocaleString()} VNĐ
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
            {product.specifications[0].price.toLocaleString()} VNĐ
          </p>
        </div>
      </div>
    );
  });
  return (
    <section>
      {/* <!-- HERO SECTION-->*/}
      <div className="container">
        <section
          className={`hero pb-3 bg-cover bg-center d-flex align-items-center ${styles.bannerStyle}`}
        >
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
