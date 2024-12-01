import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/Api';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userInfos = sessionStorage.getItem('userInfo');
        const auth_user = JSON.parse(userInfos);
        const response = await axios.post(`${API_URL}/order`, {
          user_id: auth_user.id,
        });
        setOrders(response.data.orders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-200';
      case 'unpaid':
        return 'bg-red-200';
      case 'paid':
        return 'bg-green-200';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Đơn hàng</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Mã đơn hàng</th>
              <th className="border border-gray-300 px-4 py-2">Số điện thoại</th>
              <th className="border border-gray-300 px-4 py-2">Địa chỉ</th>
              <th className="border border-gray-300 px-4 py-2">Thời gian tạo</th>
              <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
              <th className="border border-gray-300 px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="border border-gray-300 px-4 py-2">{order.id}</td>
                <td className="border border-gray-300 px-4 py-2">{order.phoneNumber}</td>
                <td className="border border-gray-300 px-4 py-2">{order.toAddress}</td>
                <td className="border border-gray-300 px-4 py-2">{order.createdAt}</td>
                <td className={`border border-gray-300 px-4 py-2 ${getStatusColor(order.status)}`}>
                  {order.status}
                </td>
                <td>
                  <button>
                    Xem chi tiết
                  </button>
                  <button>
                    Thanh toán
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Order;
