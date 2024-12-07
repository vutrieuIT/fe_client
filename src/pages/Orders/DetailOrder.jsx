import axios from "axios";
import { useParams } from "react-router-dom";
import API_URL from "../../config/Api";
import { useEffect, useState } from "react";

const DetailOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);

  const userInfo = sessionStorage.getItem("userInfo");
  const auth_user = JSON.parse(userInfo);
  const header = {
    headers: {
      Authorization: `Bearer ${auth_user?.token}`,
    },
  };

  const getDetailOrder = async () => {
    await axios
      .get(API_URL + `/order-detail/${id}`, header)
      .then((res) => {
        console.log(res.data.order);
        setOrder(res.data.order);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getDetailOrder();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Chi tiết Đơn hàng {id}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Tên sản phẩm</th>
              <th className="border border-gray-300 px-4 py-2">Màu sắc</th>
              <th className="border border-gray-300 px-4 py-2">Bộ nhớ</th>
              <th className="border border-gray-300 px-4 py-2">Số lượng</th>
              <th className="border border-gray-300 px-4 py-2">Đơn giá</th>
            </tr>
          </thead>
          <tbody>
            {
              order?.items?.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{item.productName}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.color}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.internalMemory} GB</td>
                  <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.price.toLocaleString()} vnd</td>
                </tr>
              ))
            }
            </tbody>
        </table>
      )}
    </div>
  );
};

export default DetailOrder;
