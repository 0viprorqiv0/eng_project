import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f4f5fb] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/register" className="inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-[#e65540] transition-colors mb-8">
          <ArrowLeft size={18} />
          Quay lại đăng ký
        </Link>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-[#FEF3F2] rounded-2xl flex items-center justify-center">
              <Shield size={28} className="text-[#e65540]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-navy">Chính sách bảo mật</h1>
              <p className="text-sm text-gray-400 mt-1">Cập nhật lần cuối: 01/01/2026</p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-lg font-bold text-navy mb-3">1. Thu thập thông tin</h2>
              <p className="leading-relaxed">
                Khi bạn đăng ký và sử dụng dịch vụ BeeLearn, chúng tôi có thể thu thập các thông tin sau:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li><strong>Thông tin cá nhân:</strong> Họ tên, số điện thoại, địa chỉ email.</li>
                <li><strong>Thông tin học tập:</strong> Tiến độ khóa học, điểm số bài kiểm tra, thời gian học tập.</li>
                <li><strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, thiết bị truy cập.</li>
                <li><strong>Lịch sử tương tác:</strong> Nội dung chat với BeeBot AI (để cải thiện chất lượng dịch vụ).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy mb-3">2. Mục đích sử dụng</h2>
              <p className="leading-relaxed">Chúng tôi sử dụng thông tin thu thập để:</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>Cung cấp, duy trì và cải thiện dịch vụ học tập trực tuyến.</li>
                <li>Cá nhân hóa trải nghiệm học tập và gợi ý khóa học phù hợp.</li>
                <li>Gửi thông báo về lịch học, kết quả và các chương trình ưu đãi.</li>
                <li>Hỗ trợ kỹ thuật và giải đáp thắc mắc của học viên.</li>
                <li>Phân tích dữ liệu nhằm nâng cao chất lượng giảng dạy.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy mb-3">3. Bảo vệ thông tin</h2>
              <p className="leading-relaxed">
                BeeLearn cam kết bảo vệ thông tin cá nhân của bạn bằng các biện pháp bảo mật hợp lý, bao gồm:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>Mã hóa dữ liệu truyền tải qua HTTPS/SSL.</li>
                <li>Mật khẩu được lưu trữ dưới dạng hash (bcrypt), không lưu dạng văn bản thuần.</li>
                <li>Giới hạn quyền truy cập dữ liệu chỉ cho nhân viên được ủy quyền.</li>
                <li>Kiểm tra và cập nhật bảo mật định kỳ.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy mb-3">4. Chia sẻ thông tin</h2>
              <p className="leading-relaxed">
                BeeLearn <strong>không bán, trao đổi hoặc cho thuê</strong> thông tin cá nhân của bạn cho bên thứ ba. 
                Chúng tôi chỉ chia sẻ thông tin trong các trường hợp:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>Được sự đồng ý rõ ràng của bạn.</li>
                <li>Theo yêu cầu của pháp luật hoặc cơ quan chức năng có thẩm quyền.</li>
                <li>Để bảo vệ quyền lợi hợp pháp của BeeLearn và người dùng.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy mb-3">5. Quyền của người dùng</h2>
              <p className="leading-relaxed">Bạn có quyền:</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>Truy cập và xem thông tin cá nhân đã cung cấp.</li>
                <li>Yêu cầu chỉnh sửa thông tin không chính xác.</li>
                <li>Yêu cầu xóa tài khoản và dữ liệu cá nhân (theo quy định).</li>
                <li>Từ chối nhận email marketing (qua link hủy đăng ký trong email).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy mb-3">6. Cookie & Công nghệ theo dõi</h2>
              <p className="leading-relaxed">
                BeeLearn sử dụng cookie và công nghệ tương tự để ghi nhớ phiên đăng nhập, 
                cá nhân hóa trải nghiệm và phân tích hành vi sử dụng. Bạn có thể tắt cookie 
                trong cài đặt trình duyệt, tuy nhiên một số tính năng có thể không hoạt động đầy đủ.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy mb-3">7. Liên hệ</h2>
              <p className="leading-relaxed">
                Nếu bạn có thắc mắc hoặc muốn thực hiện quyền liên quan đến dữ liệu cá nhân, vui lòng liên hệ:
              </p>
              <div className="mt-3 p-4 bg-[#f4f5fb] rounded-2xl">
                <p className="font-bold text-navy">BeeLearn Academy — Bộ phận Bảo mật</p>
                <p>📍 123 Cầu Giấy, Hà Nội</p>
                <p>📞 Hotline: 1900 6789</p>
                <p>📧 Email: privacy@beelearn.edu.vn</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
